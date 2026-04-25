import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/discussions — list discussions with author info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest"; // newest | trending
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
  const offset = Number(searchParams.get("offset") || 0);

  try {
    const supabase = getServiceSupabase();

    let query = supabase
      .from("discussions")
      .select(`
        *,
        author:user_id (
          id,
          name,
          image
        )
      `);

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (sort === "trending") {
      query = query.order("likes_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Error fetching discussions:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/discussions — create a new discussion
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, category, tags } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from("discussions")
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        content: content.trim(),
        category: category || "general",
        tags: tags || [],
      })
      .select(`
        *,
        author:user_id (
          id,
          name,
          image
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error creating discussion:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
