"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsTable } from "@/components/editor/results-table";
import { useEditorStore, useAIChatStore } from "@/store";
import { Play, Loader2, Sparkles, History, Trash2, Database, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QueryResult } from "@/types";
import { motion } from "framer-motion";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  { ssr: false, loading: () => <div className="h-[300px] rounded-lg border border-slate-800 bg-slate-900/50 animate-pulse" /> }
);

export function PlaygroundTab() {
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
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: code.trim() }),
      });
      const data = await res.json();
      
      if (data.error) {
        setResult({ columns: [], rows: [], executionTimeMs: 0, error: typeof data.error === 'string' ? data.error : JSON.stringify(data.error) });
      } else {
        // Map the API result to the QueryResult format
        const columns = data.result && data.result.length > 0 ? Object.keys(data.result[0]) : [];
        setResult({
          columns,
          rows: data.result || [],
          executionTimeMs: data.executionTime || 0,
          error: data.error || null
        });
      }
    } catch {
      setResult({ columns: [], rows: [], executionTimeMs: 0, error: "Failed to execute query" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-500" /> Personal Sandbox
          </h2>
          <p className="text-slate-400 text-sm">Experiment with SQL queries in your private workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)} 
            className="border-slate-800 hover:bg-slate-800 gap-2 h-9"
          >
            <History className="h-4 w-4" />
            History
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePanel} 
            className="border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 gap-2 h-9"
          >
            <Sparkles className="h-4 w-4" />
            AI Architect
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden backdrop-blur-sm">
            <CardContent className="p-0">
              <SQLEditor value={code} onChange={setCode} onRun={runQuery} height="350px" />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button 
              onClick={runQuery} 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 h-11 px-6 font-bold shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              Run Engine
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setCode(""); setResult(null); }}
              className="text-slate-500 hover:text-slate-300 h-11"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-800/50 px-2 py-1 rounded">Ctrl + Enter</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ResultsTable result={result} />
              </motion.div>
            ) : !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-slate-800 border-dashed p-12 text-center"
              >
                <Database className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 text-sm font-medium">Ready to execute. Select a template or write your own.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["employees", "orders", "customers", "departments"].map((table) => (
                    <button
                      key={table}
                      onClick={() => setCode(`SELECT * FROM ${table} LIMIT 10;`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all font-mono"
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {showHistory && (
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-slate-800/50">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Query History</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1">
                    {queryHistory.length === 0 && (
                      <p className="text-[10px] text-slate-600 p-4 text-center">Your query history will appear here.</p>
                    )}
                    {queryHistory.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setCode(q)}
                        className="w-full text-left rounded-lg p-3 hover:bg-indigo-500/5 hover:text-indigo-400 text-[11px] font-mono truncate transition-all group border border-transparent hover:border-indigo-500/20"
                      >
                        <span className="text-slate-600 mr-2">{queryHistory.length - i}.</span>
                        {q}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <Card className="bg-indigo-600/5 border-indigo-500/10 p-6">
            <h4 className="text-sm font-bold mb-2">Sandbox Tips</h4>
            <ul className="text-xs text-slate-400 space-y-3">
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                Use window functions like RANK() or LAG() for complex analysis.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                All queries run in a read-only environment to protect data.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500">•</span>
                Ask the AI Architect to explain or optimize your queries.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";
