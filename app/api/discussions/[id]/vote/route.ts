import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// POST /api/discussions/[id]/vote — toggle upvote on a discussion or reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { targetType, targetId } = await request.json();

  // targetType: 'discussion' | 'reply'
  // targetId: UUID of the discussion or reply
  // For convenience, if targetType is 'discussion', targetId defaults to the discussion id from the URL
  const type = targetType || "discussion";
  const target = targetId || id;

  if (!["discussion", "reply"].includes(type)) {
    return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
  }

  const userId = session.user.id;

  try {
    const supabase = getServiceSupabase();

    // Check for existing vote
    const { data: existingVote } = await supabase
      .from("discussion_votes")
      .select("id")
      .eq("user_id", userId)
      .eq("target_type", type)
      .eq("target_id", target)
      .single();

    if (existingVote) {
      // Remove vote (toggle off)
      await supabase.from("discussion_votes").delete().eq("id", existingVote.id);
      return NextResponse.json({ status: "removed", voted: false });
    }

    // Insert new vote
    const { error } = await supabase
      .from("discussion_votes")
      .insert({
        user_id: userId,
        target_type: type,
        target_id: target,
      });

    if (error) throw error;

    return NextResponse.json({ status: "added", voted: true });
  } catch (err) {
    console.error("Error voting:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/discussions/[id]/vote — check if current user has voted
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ votes: [] });
  }

  const { id } = await params;

  try {
    const supabase = getServiceSupabase();

    // Get all votes by this user for this discussion and its replies
    const { data, error } = await supabase
      .from("discussion_votes")
      .select("target_type, target_id")
      .eq("user_id", session.user.id);

    if (error) throw error;

    // Filter to only votes relevant to this discussion
    // (discussion vote + any reply votes — reply IDs need to be checked client-side)
    const discussionVote = data?.some(
      (v: { target_type: string; target_id: string }) => v.target_type === "discussion" && v.target_id === id
    );
    const replyVoteIds = data
      ?.filter((v: { target_type: string }) => v.target_type === "reply")
      .map((v: { target_id: string }) => v.target_id) || [];

    return NextResponse.json({
      discussionVoted: !!discussionVote,
      votedReplyIds: replyVoteIds,
    });
  } catch (err) {
    console.error("Error checking votes:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
