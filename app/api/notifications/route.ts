import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

// GET /api/notifications — get current user's notifications
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
  const unreadOnly = searchParams.get("unread") === "true";

  try {
    const supabase = getServiceSupabase();

    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Also get unread count
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    return NextResponse.json({
      notifications: data || [],
      unreadCount: count || 0,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notificationIds, markAll } = await request.json();

    const supabase = getServiceSupabase();

    if (markAll) {
      // Mark all as read
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", session.user.id)
        .eq("is_read", false);
    } else if (notificationIds?.length) {
      // Mark specific notifications as read
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", session.user.id)
        .in("id", notificationIds);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating notifications:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
