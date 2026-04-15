import { NextRequest, NextResponse } from "next/server";
import { explainChain, debugChain, hintChain, chatChain, optimizeChain } from "@/lib/langchain";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, error, expected, problem, level, message, context } = body;

    let result: string;

    switch (action) {
      case "explain":
        result = await explainChain.invoke({ query });
        break;
      case "debug":
        result = await debugChain.invoke({ query, error: error || "No error message", expected: expected || "Not specified" });
        break;
      case "hint":
        result = await hintChain.invoke({ problem, level: String(level || 1) });
        break;
      case "optimize":
        result = await optimizeChain.invoke({ query });
        break;
      case "chat":
        result = await chatChain.invoke({ message, context: context || "No previous context" });
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("AI API error:", err);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
