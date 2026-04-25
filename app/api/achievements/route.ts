import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  first_solve: {
    title: "First Blood",
    description: "Solved your first problem",
    icon: "🎯",
  },
  solved_5: {
    title: "Getting Started",
    description: "Solved 5 problems",
    icon: "⚡",
  },
  solved_10: {
    title: "Double Digits",
    description: "Solved 10 problems",
    icon: "🔥",
  },
  solved_25: {
    title: "Quarter Century",
    description: "Solved 25 problems",
    icon: "💎",
  },
  solved_50: {
    title: "Half Century",
    description: "Solved 50 problems",
    icon: "🏆",
  },
  solved_100: {
    title: "Centurion",
    description: "Solved 100 problems",
    icon: "👑",
  },
  streak_3: {
    title: "On a Roll",
    description: "3-day streak",
    icon: "🔥",
  },
  streak_7: {
    title: "Week Warrior",
    description: "7-day streak",
    icon: "⚔️",
  },
  streak_14: {
    title: "Unstoppable",
    description: "14-day streak",
    icon: "🚀",
  },
  streak_30: {
    title: "Monthly Master",
    description: "30-day streak",
    icon: "🌟",
  },
  xp_500: {
    title: "XP Collector",
    description: "Earned 500 XP",
    icon: "✨",
  },
  xp_1000: {
    title: "XP Hoarder",
    description: "Earned 1,000 XP",
    icon: "💰",
  },
  xp_5000: {
    title: "XP Legend",
    description: "Earned 5,000 XP",
    icon: "🏅",
  },
  first_discussion: {
    title: "Community Voice",
    description: "Started your first discussion",
    icon: "💬",
  },
  first_reply: {
    title: "Helpful Hand",
    description: "Posted your first reply",
    icon: "🤝",
  },
};

/**
 * Check and unlock achievements for a user.
 * Called after submissions, discussion creation, etc.
 */
export async function checkAndUnlockAchievements(userId: string) {
  const supabase = getServiceSupabase();
  const newlyUnlocked: string[] = [];

  // Get user's existing achievements
  const { data: existing } = await supabase
    .from("achievements")
    .select("achievement_key")
    .eq("user_id", userId);

  const unlockedKeys = new Set(
    existing?.map((a: { achievement_key: string }) => a.achievement_key) || []
  );

  // Get user profile stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_solved, xp, streak, best_streak")
    .eq("user_id", userId)
    .single();

  if (!profile) return newlyUnlocked;

  // Check solve milestones
  const solveMilestones: [number, string][] = [
    [1, "first_solve"],
    [5, "solved_5"],
    [10, "solved_10"],
    [25, "solved_25"],
    [50, "solved_50"],
    [100, "solved_100"],
  ];

  for (const [threshold, key] of solveMilestones) {
    if ((profile.total_solved ?? 0) >= threshold && !unlockedKeys.has(key)) {
      newlyUnlocked.push(key);
    }
  }

  // Check streak milestones (use best_streak for lifetime achievements)
  const streakVal = Math.max(profile.streak ?? 0, profile.best_streak ?? 0);
  const streakMilestones: [number, string][] = [
    [3, "streak_3"],
    [7, "streak_7"],
    [14, "streak_14"],
    [30, "streak_30"],
  ];

  for (const [threshold, key] of streakMilestones) {
    if (streakVal >= threshold && !unlockedKeys.has(key)) {
      newlyUnlocked.push(key);
    }
  }

  // Check XP milestones
  const xpMilestones: [number, string][] = [
    [500, "xp_500"],
    [1000, "xp_1000"],
    [5000, "xp_5000"],
  ];

  for (const [threshold, key] of xpMilestones) {
    if ((profile.xp ?? 0) >= threshold && !unlockedKeys.has(key)) {
      newlyUnlocked.push(key);
    }
  }

  // Check discussion milestones
  const { count: discussionCount } = await supabase
    .from("discussions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((discussionCount ?? 0) >= 1 && !unlockedKeys.has("first_discussion")) {
    newlyUnlocked.push("first_discussion");
  }

  // Check reply milestones
  const { count: replyCount } = await supabase
    .from("discussion_replies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((replyCount ?? 0) >= 1 && !unlockedKeys.has("first_reply")) {
    newlyUnlocked.push("first_reply");
  }

  // Insert newly unlocked achievements + create notifications
  for (const key of newlyUnlocked) {
    const def = ACHIEVEMENT_DEFINITIONS[key];

    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_key: key,
    });

    if (def) {
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "achievement",
        title: `Achievement Unlocked: ${def.title}`,
        message: `${def.icon} ${def.description}`,
        link: "/profile",
      });
    }
  }

  return newlyUnlocked;
}

// GET /api/achievements — get current user's achievements (or any user's via ?userId=)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let targetUserId = searchParams.get("userId");

  // If no userId param, use current session user
  if (!targetUserId) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    targetUserId = session.user.id;
  }

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", targetUserId)
      .order("unlocked_at", { ascending: false });

    if (error) throw error;

    // Enrich with definitions
    const enriched = (data || []).map(
      (a: { achievement_key: string; [key: string]: unknown }) => ({
        ...a,
        ...(ACHIEVEMENT_DEFINITIONS[a.achievement_key] || {}),
      })
    );

    return NextResponse.json({
      achievements: enriched,
      allDefinitions: ACHIEVEMENT_DEFINITIONS,
    });
  } catch (err) {
    console.error("Error fetching achievements:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
