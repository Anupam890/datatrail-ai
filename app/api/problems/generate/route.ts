import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { generateProblemChain } from "@/lib/langchain";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { difficulty = "medium", tags = "general SQL" } = body;

    // Fetch a few existing problems for schema reference
    const supabase = getServiceSupabase();
    const { data: existingProblems } = await supabase
      .from("problems")
      .select("schema_json")
      .limit(3);

    const existingSchemas = existingProblems
      ? existingProblems.map((p: any) => JSON.stringify(p.schema_json)).join("\n---\n")
      : "None";

    // Generate problem via AI
    const result = await generateProblemChain.invoke({
      difficulty,
      tags,
      existingSchemas,
    });

    // Parse the JSON response
    const problemData = JSON.parse(result);

    // Create a slug from the title
    const slug = problemData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("problems")
      .select("id")
      .eq("slug", slug)
      .single();

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    // Insert into database
    const { data: newProblem, error: insertError } = await supabase
      .from("problems")
      .insert({
        title: problemData.title,
        slug: finalSlug,
        description: problemData.description,
        difficulty: problemData.difficulty || difficulty,
        tags: problemData.tags || [tags],
        schema_json: problemData.schema_json,
        sample_data_json: problemData.sample_data_json,
        expected_output_json: problemData.expected_output_json,
        solution_query: problemData.solution_query,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save generated problem", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      problem: newProblem,
      slug: finalSlug,
    });
  } catch (error) {
    console.error("Problem generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate problem. Try again." },
      { status: 500 }
    );
  }
}
