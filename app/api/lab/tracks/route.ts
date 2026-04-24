import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Fetch all tracks with lesson count
    const { data: tracks, error } = await supabase
      .from("sql_tracks")
      .select("*, sql_lessons(id, title, slug, sort_order)")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform: add lessonCount and sort lessons
    const result = (tracks || []).map((track) => ({
      ...track,
      lessons: (track.sql_lessons || []).sort(
        (a: { sort_order: number }, b: { sort_order: number }) =>
          a.sort_order - b.sort_order
      ),
      lessonCount: (track.sql_lessons || []).length,
      sql_lessons: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Tracks Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
