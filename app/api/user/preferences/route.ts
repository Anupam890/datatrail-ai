import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DEFAULTS = {
  font_size: 14,
  tab_size: 2,
  sql_dialect: "postgresql",
  animated_transitions: true,
  compact_mode: false,
};

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prefs) {
      return NextResponse.json({ user_id: session.user.id, ...DEFAULTS });
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Preferences Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const data = await request.json();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("user_preferences").upsert({
      user_id: session.user.id,
      font_size: data.fontSize ?? DEFAULTS.font_size,
      tab_size: data.tabSize ?? DEFAULTS.tab_size,
      sql_dialect: data.sqlDialect ?? DEFAULTS.sql_dialect,
      animated_transitions:
        data.animatedTransitions ?? DEFAULTS.animated_transitions,
      compact_mode: data.compactMode ?? DEFAULTS.compact_mode,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Preferences Update Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update preferences" },
      { status: 500 }
    );
  }
}
