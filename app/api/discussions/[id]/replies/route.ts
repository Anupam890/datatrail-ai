import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/discussions/[id]/replies — list replies for a discussion
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("discussion_replies")
      .select(`
        *,
        author:user_id (
          id,
          name,
          image
        )
      `)
      .eq("discussion_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Error fetching replies:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/discussions/[id]/replies — add a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Verify discussion exists
    const { data: discussion } = await supabase
      .from("discussions")
      .select("id")
      .eq("id", id)
      .single();

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("discussion_replies")
      .insert({
        discussion_id: id,
        user_id: session.user.id,
        content: content.trim(),
      })
      .select(`
        *,
        author:user_id (
          id,
          name,
          image
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error posting reply:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
