"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import initSqlJs, { type Database as SqlDatabase, type SqlValue } from "sql.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/editor/results-table";
import { usePlaygroundStore, type Question, type DataAnalysis } from "@/store/use-playground-store";
import type { QueryResult } from "@/types";
import {
  ArrowLeft,
  Play,
  Loader2,
  FlaskConical,
  Upload,
  FileSpreadsheet,
  Sparkles,
  Lightbulb,
  RotateCcw,
  Table2,
  BrainCircuit,
  HelpCircle,
  Copy,
  Check,
  Trash2,
  ChevronDown,
  GripVertical,
  BookOpen,
  Database,
  Terminal,
  MessageSquare,
  CheckCircle2,
  Clock,
  Hash,
  AlertCircle,
} from "lucide-react";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full rounded-none bg-slate-950 animate-pulse" />
    ),
  }
);

const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const difficultyDot: Record<string, string> = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-rose-500",
};

// ---------------------------------------------------------------------------
// Upload Phase — compact centered card
// ---------------------------------------------------------------------------
function UploadPhase() {
  const { loadCsv, setPhase, setAnalysis } = usePlaygroundStore();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError("");
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a .csv file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large. Max 5 MB.");
        return;
      }

      setLoading(true);
      setPhase("analyzing");

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          const data = results.data as Record<string, unknown>[];
          const columns = results.meta.fields || [];

          if (data.length === 0 || columns.length === 0) {
            setError("CSV file is empty or has no valid columns.");
            setPhase("upload");
            setLoading(false);
            return;
          }

          loadCsv(data, columns, file.name);

          const sampleRows = data
            .slice(0, 5)
            .map((r) => JSON.stringify(r))
            .join("\n");
          const tableName = file.name
            .replace(/\.csv$/i, "")
            .replace(/[^a-zA-Z0-9_]/g, "_");

          try {
            const res = await fetch("/api/ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "analyze_csv",
                tableName,
                columns: columns.join(", "),
                sampleRows,
              }),
            });
            const text = await res.text();
            const cleaned = text
              .replace(/```json\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
            const analysis = JSON.parse(cleaned);
            setAnalysis(
              analysis && typeof analysis === "object"
                ? analysis
                : {
                    summary: `Dataset "${file.name}" with ${data.length} rows and ${columns.length} columns.`,
                    columns: columns.map((c) => ({
                      name: c,
                      type: "unknown",
                      description: "",
                    })),
                    relationships: [],
                    insights: [],
                  }
            );
          } catch {
            setAnalysis({
              summary: `Dataset "${file.name}" with ${data.length} rows and ${columns.length} columns.`,
              columns: columns.map((c) => ({
                name: c,
                type: "unknown",
                description: "",
              })),
              relationships: [],
              insights: [],
            });
          }

          setPhase("practice");
          setLoading(false);
        },
        error: () => {
          setError("Failed to parse CSV file.");
          setPhase("upload");
          setLoading(false);
        },
      });
    },
    [loadCsv, setPhase, setAnalysis]
  );

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8 max-w-lg w-full px-4"
      >
        {loading ? (
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
            <p className="text-slate-400 text-sm">
              Analyzing your data with AI...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Upload Your Data
              </h2>
              <p className="text-slate-400 text-sm">
                Drop a CSV file and AI will analyze it, generate practice
                questions, and let you query it with SQL.
              </p>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) processFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                ${
                  dragOver
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50"
                }
              `}
            >
              <Upload
                className={`h-10 w-10 mx-auto mb-4 ${dragOver ? "text-indigo-400" : "text-slate-600"}`}
              />
              <p className="text-sm font-medium text-slate-300 mb-1">
                Drag & drop your CSV file here
              </p>
              <p className="text-xs text-slate-600">
                or click to browse (max 5 MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-rose-400"
              >
                {error}
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Resizable split pane hook
// ---------------------------------------------------------------------------
function useResizable(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = ev.clientX - startX.current;
        const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta));
        setWidth(newWidth);
      };

      const onMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width, minWidth, maxWidth]
  );

  return { width, onMouseDown };
}

// ---------------------------------------------------------------------------
// Left panel tab: Description
// ---------------------------------------------------------------------------
function DescriptionTab({
  activeQuestion,
  analysis,
}: {
  activeQuestion: Question | null;
  analysis: DataAnalysis | null;
}) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full custom-scrollbar">
      {activeQuestion ? (
        <>
          {/* Question header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {activeQuestion.id}. {activeQuestion.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] gap-1 capitalize ${difficultyColor[activeQuestion.difficulty]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${difficultyDot[activeQuestion.difficulty]}`}
                />
                {activeQuestion.difficulty}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-800/60 pt-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeQuestion.description}
            </p>
          </div>

          {/* Approach */}
          {activeQuestion.approach && (
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-800/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Approach
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeQuestion.approach}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* AI analysis summary when no question selected */}
          {analysis && (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">
                  AI Analysis
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
              {analysis.insights && analysis.insights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Insights
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.insights.map((insight, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/10"
                      >
                        {insight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {!analysis && (
            <div className="text-center py-8">
              <BookOpen className="h-8 w-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Select a question to view its description
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left panel tab: Schema
// ---------------------------------------------------------------------------
function SchemaTab({
  csvColumns,
  csvData,
  tableName,
  analysis,
}: {
  csvColumns: string[];
  csvData: Record<string, unknown>[];
  tableName: string;
  analysis: DataAnalysis | null;
}) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full custom-scrollbar">
      {/* Table info */}
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-mono font-bold text-indigo-400">
          {tableName}
        </span>
        <span className="text-[10px] text-slate-600 ml-auto">
          {csvData.length} rows
        </span>
      </div>

      {/* Columns list */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Columns
        </p>
        {csvColumns.map((col, i) => {
          const sample = csvData[0]?.[col];
          const type =
            typeof sample === "number"
              ? Number.isInteger(sample)
                ? "INTEGER"
                : "REAL"
              : "TEXT";
          const analysisCol = analysis?.columns?.find(
            (c) => c.name === col
          );
          return (
            <div
              key={col}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-colors group"
            >
              <span className="text-[10px] text-slate-600 font-mono w-5">
                {i + 1}
              </span>
              <span className="text-xs font-mono text-slate-300 flex-1">
                {col}
              </span>
              <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded bg-slate-800/50">
                {type}
              </span>
              {analysisCol?.description && (
                <span className="text-[10px] text-slate-500 max-w-[120px] truncate hidden group-hover:inline">
                  {analysisCol.description}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Relationships */}
      {analysis?.relationships && analysis.relationships.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Relationships
          </p>
          {analysis.relationships.map((rel, i) => (
            <p key={i} className="text-xs text-slate-400 leading-relaxed">
              {rel}
            </p>
          ))}
        </div>
      )}

      {/* Sample rows */}
      <div className="pt-2 border-t border-slate-800/50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Sample Data (First 3 Rows)
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-800/50">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                {csvColumns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-mono font-bold text-slate-500 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(0, 3).map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800/30 last:border-0"
                >
                  {csvColumns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-1.5 font-mono text-slate-400 whitespace-nowrap"
                    >
                      {row[col] == null ? (
                        <span className="text-slate-700 italic">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left panel tab: AI Help
// ---------------------------------------------------------------------------
function AIHelpTab({
  activeQuestion,
  aiHelp,
  isAiHelpLoading,
  onGetHelp,
}: {
  activeQuestion: Question | null;
  aiHelp: string;
  isAiHelpLoading: boolean;
  onGetHelp: () => void;
}) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full custom-scrollbar">
      {activeQuestion ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">AI Assistant</span>
            </div>
            <Button
              size="sm"
              onClick={onGetHelp}
              disabled={isAiHelpLoading}
              className="gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs h-7"
            >
              {isAiHelpLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <HelpCircle className="h-3 w-3" />
              )}
              {isAiHelpLoading ? "Thinking..." : "Get Hint"}
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            Stuck on &quot;{activeQuestion.title}&quot;? Ask AI for a hint.
          </p>

          {/* Hint from question data */}
          {activeQuestion.hint && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">
                Built-in Hint
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeQuestion.hint}
              </p>
            </div>
          )}

          {/* AI response */}
          {aiHelp && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/60 mb-1">
                AI Response
              </p>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiHelp}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-8 w-8 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            Select a question first to get AI help
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice Phase — LeetCode-style split layout
// ---------------------------------------------------------------------------
function PracticePhase() {
  const {
    csvData,
    csvColumns,
    tableName,
    analysis,
    questions,
    activeQuestion,
    isGeneratingQuestions,
    aiHelp,
    isAiHelpLoading,
    setQuestions,
    setActiveQuestion,
    setIsGeneratingQuestions,
    setAiHelp,
    setIsAiHelpLoading,
    resetSession,
    fileName,
  } = usePlaygroundStore();

  const [code, setCode] = useState(
    "SELECT * FROM " + tableName + " LIMIT 10;"
  );
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leftTab, setLeftTab] = useState<"description" | "schema" | "ai">(
    "description"
  );
  const [rightBottomTab, setRightBottomTab] = useState<
    "output" | "testcases"
  >("output");
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const dbRef = useRef<SqlDatabase | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { width: leftWidth, onMouseDown: onResizerMouseDown } = useResizable(
    480,
    320,
    700
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setQuestionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Initialize SQLite database from CSV data
  useEffect(() => {
    let cancelled = false;

    async function initDb() {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });
      if (cancelled) return;

      const db = new SQL.Database();

      const colDefs = csvColumns
        .map((col) => {
          const sample = csvData[0]?.[col];
          const sqlType =
            typeof sample === "number"
              ? Number.isInteger(sample)
                ? "INTEGER"
                : "REAL"
              : "TEXT";
          return `"${col}" ${sqlType}`;
        })
        .join(", ");

      db.run(`CREATE TABLE "${tableName}" (${colDefs})`);

      const placeholders = csvColumns.map(() => "?").join(", ");
      const stmt = db.prepare(
        `INSERT INTO "${tableName}" VALUES (${placeholders})`
      );
      for (const row of csvData) {
        const values: SqlValue[] = csvColumns.map((col) => {
          const v = row[col];
          if (v == null) return null;
          if (typeof v === "number" || typeof v === "string") return v;
          return String(v);
        });
        stmt.run(values);
      }
      stmt.free();

      dbRef.current = db;
    }

    initDb();
    return () => {
      cancelled = true;
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, [csvData, csvColumns, tableName]);

  // Run SQL
  async function handleRun() {
    if (!code.trim() || !dbRef.current) return;
    setLoading(true);
    setResult(null);
    setRightBottomTab("output");

    try {
      const startTime = performance.now();
      const stmtResults = dbRef.current.exec(code.trim());
      const executionTimeMs = Math.round(performance.now() - startTime);

      if (stmtResults.length > 0) {
        const first = stmtResults[0];
        const columns = first.columns;
        const rows = first.values.map((vals) => {
          const obj: Record<string, unknown> = {};
          columns.forEach((col, i) => {
            obj[col] = vals[i];
          });
          return obj;
        });
        setResult({ columns, rows, executionTimeMs });
      } else {
        setResult({ columns: [], rows: [], executionTimeMs });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to execute query";
      setResult({
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: message,
      });
    } finally {
      setLoading(false);
    }
  }

  // Generate questions
  async function handleGenerateQuestions() {
    setIsGeneratingQuestions(true);
    const schema = csvColumns
      .map((c) => {
        const sample = csvData[0]?.[c];
        const type =
          typeof sample === "number"
            ? "number"
            : typeof sample === "boolean"
              ? "boolean"
              : "string";
        return `${c} (${type})`;
      })
      .join(", ");

    const sampleRows = csvData
      .slice(0, 5)
      .map((r) => JSON.stringify(r))
      .join("\n");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_questions",
          tableName,
          schema,
          summary: analysis?.summary || "",
          sampleRows,
        }),
      });
      const text = await res.text();
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      setQuestions(Array.isArray(parsed) ? parsed : []);
    } catch {
      setQuestions([]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  }

  // AI help
  async function handleGetHelp() {
    if (!activeQuestion) return;
    setIsAiHelpLoading(true);
    setAiHelp("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          problem: `${activeQuestion.description} (Table: ${tableName}, Columns: ${csvColumns.join(", ")})`,
          level: 2,
        }),
      });
      const text = await res.text();
      setAiHelp(text);
    } catch {
      setAiHelp("Failed to get help. Try again.");
    } finally {
      setIsAiHelpLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function selectQuestion(q: Question) {
    setActiveQuestion(q);
    setCode(`-- ${q.title}\n-- ${q.description}\nSELECT `);
    setResult(null);
    setAiHelp("");
    setLeftTab("description");
    setQuestionDropdownOpen(false);
  }

  const leftTabs = [
    { id: "description" as const, label: "Description", icon: BookOpen },
    { id: "schema" as const, label: "Schema", icon: Database },
    { id: "ai" as const, label: "AI Help", icon: Lightbulb },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* ── Top toolbar ── */}
      <div className="flex items-center gap-2 px-3 h-10 border-b border-slate-800/60 bg-slate-900/40 shrink-0">
        {/* Question selector dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setQuestionDropdownOpen(!questionDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-slate-800/60 transition-colors text-xs"
          >
            <Hash className="h-3 w-3 text-slate-500" />
            <span className="text-slate-300 font-medium max-w-[200px] truncate">
              {activeQuestion
                ? `${activeQuestion.id}. ${activeQuestion.title}`
                : "Select Question"}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          <AnimatePresence>
            {questionDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 mt-1 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden"
              >
                <div className="p-2 border-b border-slate-800/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2">
                    Questions ({questions.length})
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {questions.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-xs text-slate-500">
                        No questions yet
                      </p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => selectQuestion(q)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-800/50 transition-colors ${
                          activeQuestion?.id === q.id ? "bg-slate-800/40" : ""
                        }`}
                      >
                        {activeQuestion?.id === q.id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="h-3.5 w-3.5 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className="text-xs text-slate-300 flex-1 truncate">
                          {q.id}. {q.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] shrink-0 gap-1 ${difficultyColor[q.difficulty]}`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${difficultyDot[q.difficulty]}`}
                          />
                          {q.difficulty}
                        </Badge>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* File info */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <FileSpreadsheet className="h-3 w-3 text-emerald-400" />
          <span className="font-mono text-slate-400">{fileName}</span>
          <span className="text-slate-600">
            {csvData.length}r &middot; {csvColumns.length}c
          </span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        {questions.length === 0 && (
          <Button
            size="sm"
            onClick={handleGenerateQuestions}
            disabled={isGeneratingQuestions}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] h-7 px-2.5"
          >
            {isGeneratingQuestions ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <BrainCircuit className="h-3 w-3" />
            )}
            {isGeneratingQuestions ? "Generating..." : "Generate Questions"}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetSession}
          className="gap-1.5 text-slate-500 hover:text-slate-300 rounded-md text-[11px] h-7 px-2"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* ── Main split pane ── */}
      <div className="flex flex-1 min-h-0">
        {/* ─── LEFT PANEL ─── */}
        <div
          className="flex flex-col border-r border-slate-800/60 bg-[#0d1117] shrink-0"
          style={{ width: leftWidth }}
        >
          {/* Left panel tabs */}
          <div className="flex items-center h-9 border-b border-slate-800/60 px-1 shrink-0">
            {leftTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 h-full text-[11px] font-medium transition-colors relative ${
                    leftTab === tab.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                  {leftTab === tab.id && (
                    <motion.div
                      layoutId="leftTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Left panel content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {leftTab === "description" && (
              <DescriptionTab
                activeQuestion={activeQuestion}
                analysis={analysis}
              />
            )}
            {leftTab === "schema" && (
              <SchemaTab
                csvColumns={csvColumns}
                csvData={csvData}
                tableName={tableName}
                analysis={analysis}
              />
            )}
            {leftTab === "ai" && (
              <AIHelpTab
                activeQuestion={activeQuestion}
                aiHelp={aiHelp}
                isAiHelpLoading={isAiHelpLoading}
                onGetHelp={handleGetHelp}
              />
            )}
          </div>

          {/* Left panel: question list at bottom */}
          {questions.length > 0 && (
            <div className="border-t border-slate-800/60 max-h-48 overflow-y-auto shrink-0">
              <div className="p-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 px-2 py-1">
                  All Questions
                </p>
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => selectQuestion(q)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      activeQuestion?.id === q.id
                        ? "bg-indigo-500/10 text-white"
                        : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${difficultyDot[q.difficulty]}`}
                    />
                    <span className="text-[11px] truncate flex-1">
                      {q.id}. {q.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── RESIZER ─── */}
        <div
          onMouseDown={onResizerMouseDown}
          className="w-1 bg-slate-800/40 hover:bg-indigo-500/40 transition-colors cursor-col-resize flex items-center justify-center shrink-0 group"
        >
          <GripVertical className="h-4 w-4 text-slate-700 group-hover:text-indigo-400 transition-colors" />
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0e17]">
          {/* Editor section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Editor toolbar */}
            <div className="flex items-center gap-2 h-9 px-3 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-rose-500/60" />
                <div className="h-2 w-2 rounded-full bg-amber-500/60" />
                <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
              </div>
              <Terminal className="h-3 w-3 text-slate-600 ml-2" />
              <span className="text-[10px] font-mono text-slate-500">
                playground.sql
              </span>
              <div className="flex-1" />
              <span className="text-[10px] text-slate-600 font-mono">
                Ctrl+Enter to run
              </span>
            </div>

            {/* Editor container */}
            <div className="flex-1 min-h-0 bg-[#0d1117] relative group">
              <SQLEditor
                value={code}
                onChange={setCode}
                onRun={handleRun}
                height="100%"
              />
              
              {/* Subtle glass overlay on focus? Or just keep it clean */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-mono">Live</span>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-1.5 h-10 px-3 border-t border-slate-800/60 bg-slate-900/30 shrink-0">
              <Button
                onClick={handleRun}
                disabled={loading || !code.trim()}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md h-7 px-3 text-xs shadow-lg shadow-emerald-500/15"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Run
              </Button>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-500 hover:text-slate-300 rounded-md h-7 px-2 text-[11px]"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                onClick={() => {
                  setCode("SELECT ");
                  setResult(null);
                }}
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-500 hover:text-slate-300 rounded-md h-7 px-2 text-[11px]"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
              <div className="flex-1" />
              {activeQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLeftTab("ai");
                    handleGetHelp();
                  }}
                  disabled={isAiHelpLoading}
                  className="gap-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md h-7 px-2 text-[11px]"
                >
                  {isAiHelpLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Lightbulb className="h-3 w-3" />
                  )}
                  {isAiHelpLoading ? "Thinking..." : "Get Help"}
                </Button>
              )}
            </div>
          </div>

          {/* ── Output section (bottom half) ── */}
          <div className="h-[280px] border-t border-slate-800/60 flex flex-col shrink-0">
            {/* Output tabs */}
            <div className="flex items-center h-8 border-b border-slate-800/60 px-2 shrink-0">
              <button
                onClick={() => setRightBottomTab("output")}
                className={`flex items-center gap-1.5 px-3 h-full text-[11px] font-medium transition-colors relative ${
                  rightBottomTab === "output"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Terminal className="h-3 w-3" />
                Output
                {rightBottomTab === "output" && (
                  <motion.div
                    layoutId="rightBottomTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                  />
                )}
              </button>
              <button
                onClick={() => setRightBottomTab("testcases")}
                className={`flex items-center gap-1.5 px-3 h-full text-[11px] font-medium transition-colors relative ${
                  rightBottomTab === "testcases"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Table2 className="h-3 w-3" />
                Data Preview
                {rightBottomTab === "testcases" && (
                  <motion.div
                    layoutId="rightBottomTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                  />
                )}
              </button>

              {/* Status indicator */}
              {result && (
                <div className="ml-auto flex items-center gap-2 pr-2">
                  {result.error ? (
                    <span className="flex items-center gap-1 text-[10px] text-rose-400">
                      <AlertCircle className="h-3 w-3" />
                      Error
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {result.rows.length} row
                        {result.rows.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        {result.executionTimeMs}ms
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Output content */}
            <div className="flex-1 overflow-auto min-h-0">
              {rightBottomTab === "output" && (
                <div className="h-full">
                  {result ? (
                    <div className="p-2">
                      <ResultsTable result={result} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-600">
                      <div className="text-center">
                        <Terminal className="h-6 w-6 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">
                          Run a query to see results here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {rightBottomTab === "testcases" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 sticky top-0">
                        {csvColumns.map((col) => (
                          <th
                            key={col}
                            className="px-3 py-2 text-left font-mono font-bold text-slate-500 whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 10).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20"
                        >
                          {csvColumns.map((col) => (
                            <td
                              key={col}
                              className="px-3 py-1.5 font-mono text-slate-400 whitespace-nowrap"
                            >
                              {row[col] == null ? (
                                <span className="text-slate-700 italic">
                                  NULL
                                </span>
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-3 py-1.5 border-t border-slate-800/30">
                    <p className="text-[10px] text-slate-600">
                      Showing first 10 of {csvData.length} rows
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function PlaygroundPage() {
  const { phase } = usePlaygroundStore();

  return (
    <div className="h-screen bg-[#0B0F19] text-white overflow-hidden">
      {/* Top header bar */}
      <div className="flex items-center h-14 px-4 border-b border-slate-800/60 bg-[#0d1117] shrink-0">
        <Link href="/arena">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2.5 ml-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <FlaskConical className="h-3 w-3 text-emerald-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
              Sandbox
            </span>
          </div>
          <h1 className="text-base font-bold tracking-tight">
            SQL Playground
          </h1>
        </div>
      </div>

      {/* Phase content */}
      <AnimatePresence mode="wait">
        {phase === "upload" || phase === "analyzing" ? (
          <UploadPhase key="upload" />
        ) : (
          <PracticePhase key="practice" />
        )}
      </AnimatePresence>
    </div>
  );
}
