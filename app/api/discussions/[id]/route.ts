import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/discussions/[id] — get a single discussion with author info
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("discussions")
      .select(`
        *,
        author:user_id (
          id,
          name,
          image
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching discussion:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/discussions/[id] — mark as solved (author only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const supabase = getServiceSupabase();

    // Verify ownership
    const { data: discussion } = await supabase
      .from("discussions")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (discussion.user_id !== session.user.id) {
      return NextResponse.json({ error: "Only the author can mark as solved" }, { status: 403 });
    }

    const { is_solved } = await request.json();

    const { data, error } = await supabase
      .from("discussions")
      .update({ is_solved: !!is_solved, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error updating discussion:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
