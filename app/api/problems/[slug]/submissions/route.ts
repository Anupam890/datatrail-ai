import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase();

    // First get the problem ID from the slug
    const { data: problem, error: problemError } = await supabase
      .from("problems")
      .select("id")
      .eq("slug", slug)
      .single();

    if (problemError || !problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // Fetch the most recent 20 submissions for this problem
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id, user_id, problem_id, query, status, execution_time, error_message, created_at")
      .eq("problem_id", problem.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    return NextResponse.json(submissions || []);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
