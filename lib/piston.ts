/**
 * Piston API Client
 *
 * Server-side utility for executing code via a self-hosted Piston engine.
 * Piston runs user code in ephemeral Docker containers with strict
 * resource limits and no network access.
 *
 * @see https://github.com/engineer-man/piston
 */

const PISTON_API_URL = process.env.PISTON_API_URL || "http://localhost:3000";

export interface PistonResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  signal: string | null;
}

interface PistonRunResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
  };
}

/**
 * Execute Python code via Piston.
 *
 * @param code    – The full Python source to run
 * @param timeout – Run timeout in ms (default 5 000)
 * @param memoryLimit – Memory limit in bytes (default 256 MB)
 */
export async function executePython(
  code: string,
  timeout = 5000,
  memoryLimit = 256_000_000
): Promise<PistonResult> {
  const startTime = Date.now();

  const res = await fetch(`${PISTON_API_URL}/api/v2/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      version: "3.12.0",
      files: [{ name: "main.py", content: code }],
      run_timeout: timeout,
      run_memory_limit: memoryLimit,
      compile_memory_limit: -1,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Piston API error (${res.status}): ${text}`);
  }

  const data: PistonRunResponse = await res.json();
  const wallTime = Date.now() - startTime;

  return {
    stdout: data.run.stdout,
    stderr: data.run.stderr,
    exitCode: data.run.code,
    signal: data.run.signal,
    executionTimeMs: wallTime,
  };
}

/**
 * Check if Piston is reachable and Python is installed.
 */
export async function pistonHealthCheck(): Promise<{
  available: boolean;
  pythonVersion?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${PISTON_API_URL}/api/v2/runtimes`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      return { available: false, error: `HTTP ${res.status}` };
    }
    const runtimes: { language: string; version: string }[] = await res.json();
    const python = runtimes.find((r) => r.language === "python");
    return {
      available: !!python,
      pythonVersion: python?.version,
      error: python ? undefined : "Python runtime not installed on Piston",
    };
  } catch (err) {
    return {
      available: false,
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}

/**
 * Build a Python test harness that injects problem data as a DataFrame
 * and captures the user's result for comparison.
 *
 * Convention: the user's code must produce a variable called `result`.
 * If `result` is a DataFrame it is serialised to JSON records; otherwise
 * it is printed with json.dumps.
 */
export function buildPythonHarness(
  userCode: string,
  sampleData: Record<string, Record<string, unknown>[]>,
  language: "python" | "pandas"
): string {
  const dataSetup =
    language === "pandas" || Object.keys(sampleData).some((k) => k === "df")
      ? buildPandasSetup(sampleData)
      : buildPythonDictSetup(sampleData);

  return `
import json
import sys

${language === "pandas" || language === "python" ? "import pandas as pd\nimport numpy as np" : ""}

# ─── Problem Data ───
${dataSetup}

# ─── User Code ───
${userCode}

# ─── Capture Result ───
try:
    _output = result  # user must define 'result'
except NameError:
    print(json.dumps({"__error": "Your code must assign to a variable named 'result'"}))
    sys.exit(1)

if hasattr(_output, 'to_dict'):
    # DataFrame or Series
    if hasattr(_output, 'columns'):
        print(json.dumps(_output.to_dict('records'), default=str))
    else:
        print(json.dumps(_output.to_dict(), default=str))
elif isinstance(_output, (list, dict)):
    print(json.dumps(_output, default=str))
else:
    print(json.dumps(_output, default=str))
`.trim();
}

function buildPandasSetup(
  sampleData: Record<string, Record<string, unknown>[]>
): string {
  return Object.entries(sampleData)
    .map(
      ([name, rows]) =>
        `${name} = pd.DataFrame(${JSON.stringify(rows)})`
    )
    .join("\n");
}

function buildPythonDictSetup(
  sampleData: Record<string, Record<string, unknown>[]>
): string {
  return Object.entries(sampleData)
    .map(([name, rows]) => `${name} = ${JSON.stringify(rows)}`)
    .join("\n");
}
