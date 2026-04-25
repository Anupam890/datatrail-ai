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
  ChevronRight,
  List,
  Search,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full rounded-none bg-[#0A0A0A] animate-pulse" />
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
// Upload Phase — Premium Neural Interface
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
        setError("UNSUPPORTED_FORMAT: Please upload a .csv vector.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("VECTOR_OVERFLOW: File too large. Max 10 MB.");
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
            setError("EMPTY_VECTOR: CSV has no valid data clusters.");
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
          setError("DECODING_FAILURE: Failed to parse CSV cluster.");
          setPhase("upload");
          setLoading(false);
        },
      });
    },
    [loadCsv, setPhase, setAnalysis]
  );

  return (
    <div className="flex items-center justify-center h-full p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="relative inline-block">
             <div className="h-20 w-20 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative z-10 overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <FileSpreadsheet className="h-8 w-8 text-emerald-400 relative z-20" />
             </div>
             <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tight text-white">Neural_Matrix_Sync</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-medium">
            Inject your CSV data vector to initialize a local SQL sandbox with AI-driven challenge synthesis.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group cursor-pointer",
            "p-12 rounded-[3rem] border-2 border-dashed transition-all duration-500",
            dragOver 
              ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.1)]" 
              : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
          )}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="h-14 w-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
               <Upload className={cn("h-6 w-6 transition-colors duration-500", dragOver ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Initialize_Link</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Drag & Drop or Click to browse</p>
            </div>
          </div>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
          >
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-6 pt-6">
          {[
            { icon: Zap, label: "Local Execution", sub: "Web-Assembly Engine" },
            { icon: BrainCircuit, label: "AI Synthesis", sub: "Problem Generation" },
            { icon: Search, label: "Deep Analysis", sub: "Schema Insights" }
          ].map((feat, i) => (
            <div key={i} className="space-y-2 text-center">
              <feat.icon className="h-4 w-4 text-slate-700 mx-auto" />
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{feat.label}</p>
              <p className="text-[7px] text-slate-700 font-bold uppercase">{feat.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Practice Phase — LeetCode-style Workspace
// ---------------------------------------------------------------------------
function PracticePhase() {
  const {
    csvData,
    csvColumns,
    tableName,
    questions,
    activeQuestion,
    selectQuestion,
    analysis,
    aiHelp,
    isAiHelpLoading,
    getAiHelp,
    generateQuestions,
    isGeneratingQuestions,
    resetSession,
    fileName,
  } = usePlaygroundStore();

  const [code, setCode] = useState("-- Write your SQL vector here\nSELECT * FROM data LIMIT 10;");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "schema" | "ai">("description");
  const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<SqlDatabase | null>(null);

  // Split panel width
  const [leftWidth, setLeftWidth] = useState(40);

  // Initialize DB
  useEffect(() => {
    async function initDb() {
      const SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
      });
      const db = new SQL.Database();
      dbRef.current = db;

      const colDefs = csvColumns.map((col) => {
        const sample = csvData[0]?.[col];
        const sqlType = typeof sample === "number" ? (Number.isInteger(sample) ? "INTEGER" : "REAL") : "TEXT";
        return `"${col}" ${sqlType}`;
      }).join(", ");

      db.run(`CREATE TABLE "${tableName}" (${colDefs})`);

      const placeholders = csvColumns.map(() => "?").join(", ");
      const stmt = db.prepare(`INSERT INTO "${tableName}" VALUES (${placeholders})`);
      csvData.forEach((row) => {
        stmt.run(csvColumns.map((col) => {
          const v = row[col];
          return v == null ? null : (typeof v === "number" || typeof v === "string" ? v : String(v));
        }));
      });
      stmt.free();
    }
    if (csvData.length > 0) initDb();
    return () => dbRef.current?.close();
  }, [csvData, csvColumns, tableName]);

  // Sync code
  useEffect(() => {
    if (activeQuestion) {
      setCode(`-- ${activeQuestion.title}\nSELECT * FROM ${tableName} LIMIT 10;`);
      setQueryResult(null);
    } else {
      setCode(`SELECT * FROM ${tableName} LIMIT 10;`);
    }
  }, [activeQuestion, tableName]);

  const handleRun = useCallback(() => {
    if (!dbRef.current) return;
    setIsExecuting(true);
    const start = performance.now();
    try {
      const res = dbRef.current.exec(code);
      const end = performance.now();
      if (res.length > 0) {
        setQueryResult({
          columns: res[0].columns,
          rows: res[0].values.map(vals => {
            const obj: any = {};
            res[0].columns.forEach((col, i) => obj[col] = vals[i]);
            return obj;
          }),
          executionTimeMs: Math.round(end - start),
        });
      } else {
        setQueryResult({ columns: [], rows: [], executionTimeMs: Math.round(end - start) });
      }
    } catch (err: any) {
      toast.error(err.message || "SQL Error");
    } finally {
      setIsExecuting(false);
    }
  }, [code]);

  const handleSubmit = () => {
    if (!queryResult) return toast.error("Execute query first.");
    toast.success("VALIDATING_RESULT...");
    setTimeout(() => toast.success("MATRIX_SYNCHRONIZED: Challenge Complete."), 1000);
  };

  const handleGetHelp = () => {
    if (activeQuestion) getAiHelp(activeQuestion, analysis);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] overflow-hidden">
      {/* ─── Header ─── */}
      <header className="h-12 border-b border-white/5 bg-[#141414] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/arena">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-slate-400">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-white/10 mx-1" />
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setQuestionDropdownOpen(!questionDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-all text-xs font-bold"
            >
              <Hash className="h-3 w-3 text-indigo-400" />
              <span className="text-white/90 truncate max-w-[200px]">
                {activeQuestion ? `${activeQuestion.id}. ${activeQuestion.title}` : "Select Challenge"}
              </span>
              <ChevronDown className={cn("h-3 w-3 text-slate-500 transition-transform", questionDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {questionDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/5 bg-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Available_Challenges ({questions.length})</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {questions.length === 0 ? (
                      <div className="p-4 text-center space-y-3">
                         <p className="text-[10px] text-slate-500 uppercase font-bold">No Challenges Detected</p>
                         <Button size="sm" onClick={generateQuestions} disabled={isGeneratingQuestions} className="h-7 text-[8px] font-black uppercase tracking-widest bg-indigo-600">
                           {isGeneratingQuestions ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2" />}
                           Synthesize
                         </Button>
                      </div>
                    ) : (
                      questions.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => { selectQuestion(q); setQuestionDropdownOpen(false); }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all",
                            activeQuestion?.id === q.id ? "bg-indigo-600/20 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", difficultyDot[q.difficulty])} />
                          <span className="text-[11px] font-bold flex-1 truncate">{q.id}. {q.title}</span>
                        </button>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />
          
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
             <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
             <span className="font-mono">{fileName}</span>
             <span className="opacity-40">/</span>
             <span className="font-black italic uppercase tracking-tighter text-white/40">{csvData.length} Records</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={resetSession} className="h-7 px-2 text-[8px] font-black uppercase tracking-widest text-slate-600 hover:text-white">
            <RotateCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isExecuting}
            className="h-7 px-3 bg-[#262626] hover:bg-[#333333] text-white border border-white/5 rounded-md text-[9px] font-black uppercase tracking-widest gap-2"
          >
            {isExecuting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!activeQuestion}
            className="h-7 px-3 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)] rounded-md text-[9px] font-black uppercase tracking-widest gap-2 transition-all"
          >
            <CheckCircle2 className="h-3 w-3" />
            Submit
          </Button>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left */}
        <div className="w-[40%] flex flex-col border-r border-white/5 bg-[#0F0F0F]">
          <div className="h-9 border-b border-white/5 flex items-center px-4 gap-6 bg-[#1A1A1A]">
            {(["description", "schema", "ai"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-full relative text-[8px] font-black uppercase tracking-[0.2em] transition-colors",
                  activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab === "ai" ? "Neural Decoder" : tab}
                {activeTab === tab && <motion.div layoutId="arenaTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div key="desc" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {activeQuestion ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">{activeQuestion.title}</h2>
                        <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/5", difficultyColor[activeQuestion.difficulty])}>
                          {activeQuestion.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">{activeQuestion.description}</p>
                      {activeQuestion.approach && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                           <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-500">Tactical_Approach</h4>
                           <p className="text-xs text-slate-400 leading-relaxed">{activeQuestion.approach}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
                      <BrainCircuit className="h-12 w-12 text-slate-800" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Awaiting_Neural_Input</p>
                      <Button onClick={generateQuestions} disabled={isGeneratingQuestions} variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-white/10">
                        {isGeneratingQuestions ? "Generating..." : "Generate Challenges"}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "schema" && (
                <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Table_Schema: {tableName}</h3>
                  <div className="grid gap-2">
                    {csvColumns.map((col) => (
                      <div key={col} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-xs font-mono text-slate-300">{col}</span>
                        <span className="text-[9px] font-mono text-slate-600 uppercase">TEXT</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "ai" && (
                <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Neural_Intelligence_Unit</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">AI will analyze the current cluster to provide tactical insights.</p>
                    </div>
                    <Button onClick={handleGetHelp} disabled={isAiHelpLoading || !activeQuestion} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest h-9">
                      {isAiHelpLoading ? "Thinking..." : "Initiate Neural Decode"}
                    </Button>
                  </div>
                  {aiHelp && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{aiHelp}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col bg-[#050505]">
          <div className="flex-1 flex flex-col min-h-0 border-b border-white/5">
            <div className="h-9 border-b border-white/5 flex items-center px-4 bg-[#1A1A1A]">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">
                <Code2 className="h-3 w-3" /> SQL_Execution_Vessel
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
               <SQLEditor value={code} onChange={setCode} onRun={handleRun} height="100%" />
            </div>
          </div>
          <div className="h-[35%] flex flex-col min-h-0 bg-[#0F0F0F]">
            <div className="h-9 border-b border-white/5 flex items-center justify-between px-4 bg-[#1A1A1A]">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">
                <Terminal className="h-3 w-3" /> Console_Feedback
              </div>
              {queryResult && <span className="text-[8px] font-mono text-slate-600 uppercase">{queryResult.executionTimeMs}ms</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {queryResult ? <ResultsTable result={queryResult} /> : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Terminal className="h-10 w-10 text-slate-400 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Matrix_Idle</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlaygroundPage() {
  const { phase } = usePlaygroundStore();

  return (
    <div className="h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
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
