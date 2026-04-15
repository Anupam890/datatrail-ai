import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const sanitized = query.trim();
    const upper = sanitized.toUpperCase();

    // Only allow SELECT statements for safety
    if (!upper.startsWith("SELECT") && !upper.startsWith("WITH") && !upper.startsWith("EXPLAIN")) {
      return NextResponse.json(
        { error: "Only SELECT, WITH (CTE), and EXPLAIN queries are allowed" },
        { status: 403 }
      );
    }

    // Block dangerous keywords
    const blocked = ["DROP", "DELETE", "INSERT", "UPDATE", "ALTER", "CREATE", "TRUNCATE", "GRANT", "REVOKE"];
    for (const keyword of blocked) {
      if (upper.includes(keyword)) {
        return NextResponse.json(
          { error: `Queries containing ${keyword} are not allowed` },
          { status: 403 }
        );
      }
    }

    const supabase = getServiceSupabase();
    const startTime = performance.now();
    const { data, error } = await supabase.rpc("exec_sql", { query_text: sanitized });
    const executionTimeMs = Math.round(performance.now() - startTime);

    if (error) {
      return NextResponse.json({
        error: error.message,
        executionTimeMs,
        columns: [],
        rows: [],
      });
    }

    const rows = data || [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return NextResponse.json({
      columns,
      rows,
      executionTimeMs,
    });
  } catch (err) {
    console.error("SQL execution error:", err);
    return NextResponse.json(
      { error: "Failed to execute query" },
      { status: 500 }
    );
  }
}
