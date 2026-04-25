import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const problemSlug = searchParams.get("problemSlug");
    const userId = session.user.id;

    let query = supabase
      .from("submissions")
      .select(`
        *,
        problems!inner(slug)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (problemSlug) {
      query = query.eq("problems.slug", problemSlug);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Submissions API error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
