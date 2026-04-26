import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { z } from "zod";
import { executePython, buildPythonHarness } from "@/lib/piston";
import { checkAndUnlockAchievements } from "@/app/api/achievements/route";

const pythonExecuteSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string().min(1).max(10000),
  language: z.enum(["python", "pandas"]),
  mode: z.enum(["run", "submit"]).default("submit"),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { problemId, code, language, mode } = pythonExecuteSchema.parse(body);

    const supabase = getServiceSupabase();

    // 1. Fetch the problem to get sample data and expected output
    const { data: problem, error: problemError } = await supabase
      .from("problems")
      .select("title, sample_data_json, expected_output_json, schema_json")
      .eq("id", problemId)
      .single();

    if (problemError || !problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // 2. Parse sample data — build table name → rows mapping
    const sampleData: Record<string, Record<string, unknown>[]> = {};
    const sampleDataJson = problem.sample_data_json;

    if (Array.isArray(sampleDataJson)) {
      // Flat array format: treat as a single table named "df" (pandas convention)
      sampleData["df"] = sampleDataJson as Record<string, unknown>[];
    } else if (sampleDataJson && typeof sampleDataJson === "object") {
      // Keyed format: { table_name: [...rows] }
      for (const [key, val] of Object.entries(sampleDataJson)) {
        if (Array.isArray(val)) {
          sampleData[key] = val as Record<string, unknown>[];
        }
      }
    }

    // 3. Build the test harness wrapping user code
    const harness = buildPythonHarness(code, sampleData, language);

    // 4. Execute via Piston
    const pistonResult = await executePython(harness);

    // 5. Parse output
    let userOutput: unknown = null;
    let execError: string | null = null;

    if (pistonResult.exitCode !== 0) {
      execError =
        pistonResult.stderr.trim() ||
        pistonResult.stdout.trim() ||
        `Process exited with code ${pistonResult.exitCode}`;
    } else {
      try {
        // stdout should contain JSON from our harness print()
        const stdout = pistonResult.stdout.trim();
        userOutput = JSON.parse(stdout);
      } catch {
        execError = pistonResult.stderr.trim() || "Failed to parse output as JSON";
      }
    }

    // Check for harness-level errors (e.g. user didn't define `result`)
    if (
      userOutput &&
      typeof userOutput === "object" &&
      !Array.isArray(userOutput) &&
      "__error" in (userOutput as Record<string, unknown>)
    ) {
      execError = (userOutput as Record<string, unknown>).__error as string;
      userOutput = null;
    }

    // 6. Compare against expected output (only on submit)
    let success = false;
    let status = "error";

    if (execError) {
      status = "error";
    } else if (mode === "run") {
      // Run mode — just return output, no grading
      status = "executed";
      success = true;
    } else {
      // Submit mode — compare against expected
      const expected = problem.expected_output_json;
      success = deepCompareOutput(userOutput, expected);
      status = success ? "accepted" : "wrong";
    }

    // Convert output to columns/rows format for the UI
    const result = formatAsQueryResult(userOutput);

    // 7. Log the submission (only on submit mode)
    if (mode === "submit") {
      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          user_id: userId,
          problem_id: problemId,
          query: code,
          status: status,
          execution_time: pistonResult.executionTimeMs,
          error_message: execError || null,
        });

      if (submissionError) {
        console.error("Submission Log Error:", submissionError);
      }

      // 8. Update profile stats if accepted
      if (success) {
        const { count } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("problem_id", problemId)
          .eq("status", "accepted");

        if (count && count <= 1) {
          await supabase.rpc("increment_profile_stats", {
            p_user_id: userId,
            p_xp_to_add: 100,
          });
        }

        await supabase.rpc("update_user_streak", {
          p_user_id: userId,
        });

        checkAndUnlockAchievements(userId).catch((err) =>
          console.error("Achievement check error:", err)
        );
      }
    }

    return NextResponse.json({
      success,
      result,
      expected: mode === "submit" ? problem.expected_output_json : undefined,
      executionTime: pistonResult.executionTimeMs,
      status,
      error: execError,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    console.error("Python Execution Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Deep-compare user output against expected output.
 * Normalises both sides to sorted JSON strings for comparison.
 */
function deepCompareOutput(actual: unknown, expected: unknown): boolean {
  if (actual === null || actual === undefined) return false;
  if (expected === null || expected === undefined) return false;

  try {
    const normalise = (val: unknown): string => {
      if (Array.isArray(val)) {
        // Sort array of objects by their JSON representation for order-independent comparison
        const sorted = [...val].map((item) => {
          if (typeof item === "object" && item !== null) {
            // Sort object keys
            const ordered: Record<string, unknown> = {};
            for (const key of Object.keys(item as Record<string, unknown>).sort()) {
              ordered[key] = normaliseValue(
                (item as Record<string, unknown>)[key]
              );
            }
            return ordered;
          }
          return normaliseValue(item);
        });
        sorted.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        return JSON.stringify(sorted);
      }
      return JSON.stringify(normaliseValue(val));
    };

    return normalise(actual) === normalise(expected);
  } catch {
    return false;
  }
}

/**
 * Normalise individual values for comparison:
 * - Numbers: round to 6 decimal places
 * - Strings that look like numbers: convert to number
 * - null/undefined → null
 */
function normaliseValue(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return Math.round(val * 1e6) / 1e6;
  if (typeof val === "string") {
    const num = Number(val);
    if (!isNaN(num) && val.trim() !== "") {
      return Math.round(num * 1e6) / 1e6;
    }
    return val.trim().toLowerCase();
  }
  return val;
}

/**
 * Convert raw Python output into the { columns, rows } format
 * that the frontend QueryResult type expects.
 */
function formatAsQueryResult(
  output: unknown
): { columns: string[]; rows: Record<string, unknown>[] } | null {
  if (output === null || output === undefined) return null;

  if (Array.isArray(output) && output.length > 0) {
    const first = output[0];
    if (typeof first === "object" && first !== null) {
      return {
        columns: Object.keys(first as Record<string, unknown>),
        rows: output as Record<string, unknown>[],
      };
    }
    // Array of primitives — wrap as single-column result
    return {
      columns: ["result"],
      rows: output.map((val) => ({ result: val })),
    };
  }

  if (typeof output === "object" && !Array.isArray(output)) {
    const obj = output as Record<string, unknown>;
    return {
      columns: Object.keys(obj),
      rows: [obj],
    };
  }

  // Scalar value
  return {
    columns: ["result"],
    rows: [{ result: output }],
  };
}
