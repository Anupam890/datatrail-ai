import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const supabase = getServiceSupabase();

    // Fetch ranked users with computed accuracy
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url, xp, total_solved, streak, best_streak")
      .order("xp", { ascending: false })
      .range(offset, offset + limit - 1);

    if (profilesError) throw profilesError;

    // Get total count for pagination
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Compute accuracy for each user from submissions
    const userIds = (profiles || []).map((p) => p.user_id);

    let accuracyMap: Record<string, number> = {};

    if (userIds.length > 0) {
      // Get submission counts per user
      const { data: submissions } = await supabase
        .from("submissions")
        .select("user_id, status")
        .in("user_id", userIds);

      if (submissions) {
        const stats: Record<string, { total: number; accepted: number }> = {};
        for (const s of submissions) {
          if (!stats[s.user_id]) stats[s.user_id] = { total: 0, accepted: 0 };
          stats[s.user_id].total++;
          if (s.status === "accepted") stats[s.user_id].accepted++;
        }
        for (const [uid, s] of Object.entries(stats)) {
          accuracyMap[uid] = s.total > 0 ? Math.round((s.accepted / s.total) * 1000) / 10 : 0;
        }
      }
    }

    const rankedUsers = (profiles || []).map((p, i) => ({
      rank: offset + i + 1,
      userId: p.user_id,
      username: p.username,
      displayName: p.display_name,
      avatarUrl: p.avatar_url,
      points: p.xp || 0,
      solved: p.total_solved || 0,
      streak: p.streak || 0,
      bestStreak: p.best_streak || 0,
      accuracy: accuracyMap[p.user_id] || 0,
    }));

    return NextResponse.json({
      users: rankedUsers,
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
