import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { type, data } = await request.json();

    // Better Auth session check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (type === "profile") {
      const { displayName, username, bio, githubUrl, linkedinUrl, website } = data;

      // Check if username is taken if it's changing
      if (username) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("username", username)
          .single();
        
        if (existing && existing.user_id !== userId) {
          return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: userId,
          display_name: displayName,
          username: username,
          bio: bio,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          website: website,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    if (type === "snowflake") {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: userId,
          snowflake_config: data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
