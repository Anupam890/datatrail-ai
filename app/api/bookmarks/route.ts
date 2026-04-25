import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/bookmarks — list current user's bookmarked problems
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("bookmarks")
      .select(`
        id,
        problem_id,
        created_at,
        problem:problem_id (
          id,
          title,
          slug,
          difficulty,
          tags
        )
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Bookmarks fetch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/bookmarks — toggle bookmark (add if missing, remove if exists)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { problemId } = await request.json();
  if (!problemId) {
    return NextResponse.json({ error: "problemId is required" }, { status: 400 });
  }

  const userId = session.user.id;

  try {
    const supabase = getServiceSupabase();

    // Check if bookmark already exists
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("problem_id", problemId)
      .single();

    if (existing) {
      // Remove bookmark
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("problem_id", problemId);

      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await supabase
        .from("bookmarks")
        .insert({ user_id: userId, problem_id: problemId });

      return NextResponse.json({ bookmarked: true });
    }
  } catch (err) {
    console.error("Bookmark toggle error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
