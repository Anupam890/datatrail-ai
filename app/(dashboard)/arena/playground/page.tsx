"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/editor/results-table";
import {
  ArrowLeft,
  Play,
  Loader2,
  FlaskConical,
  Trash2,
  Clock,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import type { QueryResult } from "@/types";
import { useAIChatStore } from "@/store";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 animate-pulse" />
    ),
  }
);

interface HistoryEntry {
  id: number;
  query: string;
  rowCount: number;
  timeMs: number;
  error?: string;
  timestamp: Date;
}

export default function PlaygroundPage() {
  const [code, setCode] = useState("SELECT ");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const { togglePanel } = useAIChatStore();

  async function handleRun() {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: code.trim() }),
      });
      const data: QueryResult = await res.json();
      setResult(data);

      setHistory((prev) => [
        {
          id: Date.now(),
          query: code.trim(),
          rowCount: data.error ? 0 : data.rows.length,
          timeMs: data.executionTimeMs,
          error: data.error,
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 20));
    } catch {
      const errResult: QueryResult = {
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Failed to execute query",
      };
      setResult(errResult);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setCode("SELECT ");
    setResult(null);
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function loadFromHistory(query: string) {
    setCode(query);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[25%] h-[25%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/arena">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Sandbox
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              SQL Playground
            </h1>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main: Editor + Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Editor */}
            <Card className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">
                  playground.sql
                </span>
                <span className="text-[10px] text-slate-600 ml-auto font-mono">
                  Ctrl+Enter to run
                </span>
              </div>
              <CardContent className="p-0">
                <SQLEditor
                  value={code}
                  onChange={setCode}
                  onRun={handleRun}
                  height="400px"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleRun}
                disabled={loading || !code.trim()}
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Query
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 rounded-xl h-10"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 rounded-xl h-10"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePanel}
                className="gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl ml-auto"
              >
                <Sparkles className="h-4 w-4" /> AI Help
              </Button>
            </div>

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ResultsTable result={result} />
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar: Query History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="bg-slate-900/30 border-slate-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Query History
                  </span>
                </div>

                {history.length === 0 ? (
                  <div className="py-8 text-center">
                    <FlaskConical className="h-8 w-8 text-slate-800 mx-auto mb-3" />
                    <p className="text-xs text-slate-600">
                      Run a query to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => loadFromHistory(entry.query)}
                        className="w-full text-left p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/60 hover:border-indigo-500/20 transition-all group"
                      >
                        <p className="text-[11px] font-mono text-slate-300 truncate group-hover:text-white transition-colors">
                          {entry.query}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {entry.error ? (
                            <span className="text-[10px] text-rose-400">
                              Error
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              {entry.rowCount} row
                              {entry.rowCount !== 1 ? "s" : ""}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-600">
                            {entry.timeMs}ms
                          </span>
                          <span className="text-[10px] text-slate-700 ml-auto">
                            {entry.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-indigo-500/5 border-indigo-500/10">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Tips
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">&#8226;</span>
                    Write any SQL query to explore and experiment freely.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">&#8226;</span>
                    Use <span className="font-mono text-indigo-300">Ctrl+Enter</span> to run quickly.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">&#8226;</span>
                    Click any history entry to reload it.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">&#8226;</span>
                    Use <span className="text-indigo-300">AI Help</span> for query suggestions.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
