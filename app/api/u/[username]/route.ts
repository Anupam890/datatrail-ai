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
      // Fallback: search by display_name or check all profiles for a slug match
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

    // 2. Fetch Recent Submissions (Publicly viewable)
    const { data: submissions, error: subError } = await supabase
      .from("submissions")
      .select("*, problems(title, slug)")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      profile,
      submissions: submissions || [],
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
