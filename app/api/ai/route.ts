import { NextRequest } from "next/server";
import { 
  explainChain, 
  debugChain, 
  hintChain, 
  chatChain, 
  optimizeChain, 
  nl2sqlChain 
} from "@/lib/langchain";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, error, expected, problem, level, message, context, request: nlRequest, schema } = body;

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
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
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
