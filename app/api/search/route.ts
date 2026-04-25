import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/search?q=query — search problems and users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ problems: [], users: [] });
  }

  try {
    const supabase = getServiceSupabase();
    const searchPattern = `%${q}%`;

    // Search problems by title and tags
    const { data: problems } = await supabase
      .from("problems")
      .select("id, title, slug, difficulty, tags")
      .or(`title.ilike.${searchPattern},slug.ilike.${searchPattern}`)
      .limit(8);

    // Search users by username and display_name
    const { data: users } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url, xp")
      .or(`username.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
      .limit(5);

    return NextResponse.json({
      problems: problems || [],
      users: users || [],
    });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
