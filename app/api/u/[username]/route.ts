import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const supabase = getServiceSupabase();

    // 1. Fetch Profile — try exact match first, then match by slugified username
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("*");

      profile = allProfiles?.find(
        (p: any) =>
          p.username?.toLowerCase() === username.toLowerCase() ||
          p.display_name?.toLowerCase().replace(/\s+/g, "-") === username.toLowerCase()
      ) || null;
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch ALL submissions for this user (for stats computation)
    const { data: allSubmissions } = await supabase
      .from("submissions")
      .select("*, problems(title, slug, difficulty, tags)")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false });

    const submissions = allSubmissions || [];
    const recentSubmissions = submissions.slice(0, 10);

    // 3. Compute accuracy
    const totalSubmissions = submissions.length;
    const acceptedCount = submissions.filter((s: any) => s.status === "accepted").length;
    const accuracy = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

    // 4. Compute rank (position among all users by XP)
    const { data: rankedProfiles } = await supabase
      .from("profiles")
      .select("user_id, xp")
      .order("xp", { ascending: false });

    const rankIndex = (rankedProfiles || []).findIndex((p: any) => p.user_id === profile.user_id);
    const rank = rankIndex >= 0 ? rankIndex + 1 : null;
    const totalUsers = (rankedProfiles || []).length;

    // 5. Heatmap data — group submissions by date for the last 365 days
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const dateCounts: Record<string, number> = {};
    for (const sub of submissions) {
      const date = new Date(sub.created_at).toISOString().split("T")[0];
      if (new Date(date) >= oneYearAgo) {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    }

    const heatmapData: { date: string; count: number }[] = [];
    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      heatmapData.push({ date: dateStr, count: dateCounts[dateStr] || 0 });
    }

    // 6. Leaderboard — top 5 users by XP
    const { data: topProfiles } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, total_solved, xp")
      .order("xp", { ascending: false })
      .limit(5);

    const leaderboard = (topProfiles || []).map((p: any, i: number) => ({
      rank: i + 1,
      name: p.display_name || p.username,
      solved: p.total_solved || 0,
      score: p.xp || 0,
      isCurrent: p.user_id === profile.user_id,
    }));

    // 7. Recommended problems — unsolved problems for this user
    const solvedProblemIds = submissions
      .filter((s: any) => s.status === "accepted")
      .map((s: any) => s.problem_id);

    let recommendedProblems: any[] = [];
    const { data: allProblems } = await supabase
      .from("problems")
      .select("id, title, slug, difficulty, tags")
      .limit(50);

    // Compute tag skill counts (needed by both recommendations and skills display)
    const tagCounts: Record<string, { solved: number; total: number }> = {};
    if (allProblems) {
      for (const prob of allProblems) {
        const tags = prob.tags || [];
        for (const tag of tags) {
          if (!tagCounts[tag]) tagCounts[tag] = { solved: 0, total: 0 };
          tagCounts[tag].total++;
        }
      }
    }
    const solvedProblemIdSet = new Set(solvedProblemIds);
    if (allProblems) {
      for (const prob of allProblems) {
        if (solvedProblemIdSet.has(prob.id)) {
          const tags = prob.tags || [];
          for (const tag of tags) {
            if (tagCounts[tag]) tagCounts[tag].solved++;
          }
        }
      }
    }

    if (allProblems) {
      const unsolved = allProblems.filter((p: any) => !solvedProblemIds.includes(p.id));

      if (unsolved.length > 0) {
        try {
          // Build skill profile string for AI
          const skillProfile = Object.entries(tagCounts)
            .map(([tag, { solved, total }]) => `${tag}: ${total > 0 ? Math.round((solved / total) * 100) : 0}%`)
            .join(", ");

          // Build recent submissions summary
          const recentSubsSummary = recentSubmissions
            .slice(0, 10)
            .map((s: any) => `${s.problems?.title || "Unknown"} (${s.problems?.difficulty || "?"}) → ${s.status}`)
            .join("; ");

          // Build available problems list
          const availableList = unsolved
            .map((p: any) => `${p.id} | ${p.title} | ${p.difficulty} | ${(p.tags || []).join(",")}`)
            .join("\n");

          const aiRes = await fetch(new URL("/api/ai", request.url).toString(), {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              cookie: request.headers.get("cookie") || "",
            },
            body: JSON.stringify({
              action: "recommend",
              skills: skillProfile || "No data yet",
              recentSubmissions: recentSubsSummary || "No submissions yet",
              solvedCount: String(solvedProblemIds.length),
              availableProblems: availableList,
            }),
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            const parsed = JSON.parse(aiData.result);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const recommendedIds = parsed.map((r: any) => r.id);
              const reasons = Object.fromEntries(parsed.map((r: any) => [r.id, r.reason]));
              recommendedProblems = unsolved
                .filter((p: any) => recommendedIds.includes(p.id))
                .map((p: any) => ({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  difficulty: p.difficulty,
                  reason: reasons[p.id] || undefined,
                }));
            }
          }
        } catch {
          // AI recommendation failed — fall through to random fallback
        }
      }

      // Fallback: random if AI returned nothing
      if (recommendedProblems.length === 0) {
        const unsolved = allProblems.filter((p: any) => !solvedProblemIds.includes(p.id));
        const shuffled = unsolved.sort(() => 0.5 - Math.random());
        recommendedProblems = shuffled.slice(0, 3).map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty,
        }));
      }
    }

    // 8. Daily challenge — deterministic pick based on today's date
    let dailyChallenge = null;
    if (allProblems && allProblems.length > 0) {
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      const idx = dayOfYear % allProblems.length;
      const p = allProblems[idx];
      dailyChallenge = {
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.tags?.length ? `Practice your ${p.tags.slice(0, 2).join(" & ")} skills` : "Sharpen your SQL skills",
      };
    }

    // 9. Skill progress — already computed above (tagCounts), just format
    const skills = Object.entries(tagCounts)
      .map(([name, { solved, total }]) => ({
        name,
        percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);

    return NextResponse.json({
      profile,
      submissions: recentSubmissions,
      accuracy,
      rank,
      totalUsers,
      heatmapData,
      leaderboard,
      recommendedProblems,
      dailyChallenge,
      skills,
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
