
import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { voteType, userId } = await request.json();

  if (!userId || !voteType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

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

    // 2. Check for existing vote
    const { data: existingVote } = await supabase
      .from("problem_votes")
      .select("id, vote_type")
      .eq("user_id", userId)
      .eq("problem_id", problem.id)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking same button
        await supabase.from("problem_votes").delete().eq("id", existingVote.id);
        return NextResponse.json({ status: "removed" });
      } else {
        // Update vote type
        // Note: The trigger handles the count updates on DELETE/INSERT. 
        // For UPDATE, we might need a separate trigger or just delete and re-insert.
        // Let's delete and re-insert to keep it simple and use the existing triggers.
        await supabase.from("problem_votes").delete().eq("id", existingVote.id);
        await supabase.from("problem_votes").insert({
          user_id: userId,
          problem_id: problem.id,
          vote_type: voteType
        });
        return NextResponse.json({ status: "updated" });
      }
    }

    // 3. Insert new vote
    const { error } = await supabase
      .from("problem_votes")
      .insert({
        user_id: userId,
        problem_id: problem.id,
        vote_type: voteType
      });

    if (error) throw error;

    return NextResponse.json({ status: "added" });
  } catch (err) {
    console.error("Error voting:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
