import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  explainChain, 
  debugChain, 
  hintChain, 
  chatChain, 
  optimizeChain, 
  nl2sqlChain,
  analyzeDataChain,
  generateQuestionsChain,
  reviewChain,
  recommendChain,
  generateProblemChain,
} from "@/lib/langchain";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, query, error, expected, problem, level, message, context, request: nlRequest, schema, tableName, columns, sampleRows, summary, status, skills, recentSubmissions, solvedCount, availableProblems, difficulty, tags, existingSchemas } = body;

    let chain;
    let input: any;

    switch (action) {
      case "explain":
        chain = explainChain;
        input = { query };
        break;
      case "debug":
        chain = debugChain;
        input = { query, error: error || "No error message", expected: expected || "Not specified" };
        break;
      case "hint":
        chain = hintChain;
        input = { problem, level: String(level || 1) };
        break;
      case "optimize":
        chain = optimizeChain;
        input = { query };
        break;
      case "chat":
        chain = chatChain;
        input = { message, context: context || "No previous context" };
        break;
      case "nl2sql":
        chain = nl2sqlChain;
        input = { request: nlRequest, schema, problem: problem || "Not specified" };
        break;
      case "analyze_csv":
        chain = analyzeDataChain;
        input = { tableName: tableName || "data", columns: columns || "", sampleRows: sampleRows || "" };
        break;
      case "generate_questions":
        chain = generateQuestionsChain;
        input = { tableName: tableName || "data", schema: schema || "", summary: summary || "", sampleRows: sampleRows || "" };
        break;
      case "tutor_playground":
        chain = explainChain; 
        input = { query: `Problem: ${JSON.stringify(body.question)}\nContext: ${JSON.stringify(body.analysis)}` };
        break;
      case "review":
        chain = reviewChain;
        input = { query, problem: problem || "Not specified", schema: schema || "Not specified", status: status || "unknown", error: error || "None" };
        break;
      case "recommend":
        chain = recommendChain;
        input = { skills: skills || "No data", recentSubmissions: recentSubmissions || "No data", solvedCount: String(solvedCount || 0), availableProblems: availableProblems || "No data" };
        break;
      case "generate_problem":
        chain = generateProblemChain;
        input = { difficulty: difficulty || "medium", tags: tags || "general SQL", existingSchemas: existingSchemas || "None provided" };
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    const isJsonAction = ["analyze_csv", "generate_questions", "recommend", "generate_problem"].includes(action);

    if (isJsonAction) {
      const result = await chain.invoke(input);
      return new Response(JSON.stringify({ result }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await chain.stream(input);
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      }
    );

  } catch (err) {
    console.error("AI API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process AI request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
