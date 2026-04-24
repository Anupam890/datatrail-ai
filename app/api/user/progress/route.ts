import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch user's lesson progress
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_slug, completed_at")
      .eq("user_id", session.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Progress Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Mark a lesson as completed
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lesson_slug } = await request.json();

    if (!lesson_slug) {
      return NextResponse.json(
        { error: "lesson_slug is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Upsert progress (ignore if already completed)
    const { data, error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: session.user.id,
          lesson_slug,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_slug" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Progress Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Unmark a lesson (remove completion)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lesson_slug } = await request.json();

    if (!lesson_slug) {
      return NextResponse.json(
        { error: "lesson_slug is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", session.user.id)
      .eq("lesson_slug", lesson_slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
