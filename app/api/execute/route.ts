import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { z } from "zod";

const executeSchema = z.object({
  problemId: z.string().uuid().optional(),
  query: z.string().min(1).max(5000),
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
    const { problemId, query } = executeSchema.parse(body);

    const supabase = getServiceSupabase();

    // 1. Call the SQL Execution Engine (RPC)
    const { data, error: rpcError } = await supabase.rpc("execute_sql", {
      p_problem_id: problemId,
      p_user_query: query,
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    const { success, result, execution_time, status, error: execError } = data;

    // 2. Log the submission
    const { error: submissionError } = await supabase
      .from("submissions")
      .insert({
        user_id: userId,
        problem_id: problemId || null,
        query: query,
        status: status || (execError ? "error" : "wrong"),
        execution_time: execution_time || 0,
        error_message: execError || null,
      });

    if (submissionError) {
      console.error("Submission Log Error:", submissionError);
    }

    // 3. Update Profile Stats if Accepted and not a sandbox query
    if (success && problemId) {
      // Check if this is the first time the user solved this problem
      const { count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("problem_id", problemId)
        .eq("status", "accepted");

      if (count && count <= 1) {
        // Increment total_solved and add XP
        await supabase.rpc("increment_profile_stats", {
          p_user_id: userId,
          p_xp_to_add: 100, // Fixed XP for now
        });
      }
    }

    return NextResponse.json({
      success,
      result,
      executionTime: execution_time,
      status,
      error: execError,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    console.error("Execution Endpoint Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
