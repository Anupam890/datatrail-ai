import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Better Auth session check
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no profile exists, return a default or create one
    if (!profile) {
      return NextResponse.json({
        display_name: session.user.name,
        email: session.user.email,
        user_id: session.user.id
      });
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
