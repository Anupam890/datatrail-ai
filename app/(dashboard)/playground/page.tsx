"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsTable } from "@/components/editor/results-table";
import { useEditorStore, useAIChatStore } from "@/store";
import { Play, Loader2, Sparkles, History, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QueryResult } from "@/types";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border bg-muted animate-pulse" /> }
);

export default function PlaygroundPage() {
  const { code, setCode, queryHistory, addToHistory } = useEditorStore();
  const { togglePanel } = useAIChatStore();
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  async function runQuery() {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);
    addToHistory(code.trim());

    try {
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: code.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ columns: [], rows: [], executionTimeMs: 0, error: "Failed to execute query" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SQL Playground</h1>
          <p className="text-muted-foreground text-sm">Write and run SQL queries against sample datasets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={togglePanel} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Help
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <SQLEditor value={code} onChange={setCode} onRun={runQuery} height="300px" />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Button onClick={runQuery} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Query
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setCode(""); setResult(null); }}>
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
            <span className="text-xs text-muted-foreground ml-2">Ctrl+Enter to run</span>
          </div>

          {result && <ResultsTable result={result} />}

          {!result && !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-sm">Run a query to see results here</p>
                <div className="mt-4 grid grid-cols-2 gap-2 max-w-md mx-auto">
                  {["SELECT * FROM employees LIMIT 10;", "SELECT * FROM orders LIMIT 10;", "SELECT * FROM customers;", "SELECT * FROM departments;"].map((q) => (
                    <Button key={q} variant="outline" size="sm" className="text-xs font-mono" onClick={() => setCode(q)}>
                      {q.replace("SELECT * FROM ", "").replace(";", "")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Query History Sidebar */}
        {showHistory && (
          <Card className="h-fit max-h-[600px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Query History</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {queryHistory.length === 0 && (
                    <p className="text-xs text-muted-foreground p-2">No queries yet</p>
                  )}
                  {queryHistory.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setCode(q)}
                      className="w-full text-left rounded-md p-2 hover:bg-accent text-xs font-mono truncate transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
