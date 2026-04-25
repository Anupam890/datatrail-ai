
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const supabase = getServiceSupabase();

    // 1. Get problem ID from slug
    const { data: problem } = await supabase
      .from("problems")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // 2. Fetch solutions for this problem
    const { data, error } = await supabase
      .from("problem_solutions")
      .select(`
        *,
        user:user_id (
          id,
          name,
          image
        )
      `)
      .eq("problem_id", problem.id)
      .order("likes_count", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching solutions:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { title, content, query } = await request.json();
  const userId = session.user.id;

  try {
    const supabase = getServiceSupabase();

    // 1. Get problem ID
    const { data: problem } = await supabase
      .from("problems")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // 2. Insert solution
    const { data, error } = await supabase
      .from("problem_solutions")
      .insert({
        problem_id: problem.id,
        user_id: userId,
        title,
        content,
        query,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error posting solution:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
