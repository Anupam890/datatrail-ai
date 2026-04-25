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
  Search,
  Zap,
  Code2,
  Shuffle,
  ChevronLeft,
  Settings,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flame,
  User,
  Trophy,
  Command,
  Monitor,
  AlignLeft,
  Bookmark,
  Braces,
  Lock,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSupabaseRealtime } from "@/hooks/use-realtime";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { colors } from "@/lib/colors";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full rounded-none bg-[#0A0A0A] animate-pulse" />
    ),
  }
);

const difficultyColor = {
  easy: `bg-[${colors.success.background}] text-[${colors.success.text}] border-[${colors.success.border}]`,
  medium: `bg-[${colors.warning.background}] text-[${colors.warning.text}] border-[${colors.warning.border}]`,
  hard: `bg-[${colors.danger.background}] text-[${colors.danger.text}] border-[${colors.danger.border}]`,
};

const difficultyDot = {
  easy: `bg-[${colors.success.dot}]`,
  medium: `bg-[${colors.warning.dot}]`,
  hard: `bg-[${colors.danger.dot}]`,
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
          <h2 className="text-4xl font-black italic uppercase tracking-tight text-white">Import Dataset</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-medium">
            Upload your CSV dataset to initialize a local SQL sandbox with AI-generated challenges.
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
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Upload File</p>
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

  const { data: session } = useSession();
  const { onlineCount } = useSupabaseRealtime({
    problemId: undefined,
    problemSlug: "playground",
    userId: session?.user?.id,
    userName: session?.user?.name,
  });

  // Fetch User Profile (for streak)
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!session?.user,
  });

  const [code, setCode] = useState("-- Write your SQL vector here\nSELECT * FROM data LIMIT 10;");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "solutions" | "submissions">("description");
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
    toast.success("Submitting solution...");
    setTimeout(() => toast.success("Success: Challenge Complete."), 1000);
  };

  const handleGetHelp = () => {
    if (activeQuestion) getAiHelp(activeQuestion, analysis);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun, handleSubmit]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: colors.background.main }}>
      {/* ─── Header ─── */}
      <header 
        className="h-12 border-b flex items-center justify-between px-4 shrink-0"
        style={{ 
          backgroundColor: colors.background.active,
          borderColor: colors.border.subtle
        }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="h-8 gap-2 text-slate-400 hover:text-white transition-colors">
            <Link href="/arena">
              <List className="h-4 w-4" />
              <span>Problem List</span>
            </Link>
          </Button>

          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500">
              <Shuffle className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
             <Button
                variant="ghost"
                size="sm"
                onClick={handleRun}
                disabled={isExecuting}
                className="h-7 px-3 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/5 gap-2"
              >
                {isExecuting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-indigo-400 text-indigo-400" />}
                Run
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSubmit}
                disabled={!activeQuestion}
                className="h-7 px-3 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2"
              >
                <CheckCircle2 className="h-3 w-3" />
                Submit
              </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:bg-indigo-500/10" onClick={generateQuestions}>
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 mr-4">
            <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 cursor-pointer">
               <Flame className="h-4 w-4 text-amber-500" />
               <span className="text-xs font-bold">{profile?.streak || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 cursor-pointer">
               <Clock className="h-4 w-4" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Collaborate</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-7 bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 text-[10px] font-black uppercase tracking-tight">
              Premium
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left */}
        <div 
          className="w-[45%] flex flex-col border-r relative"
          style={{ 
            backgroundColor: colors.background.subtle,
            borderColor: colors.border.muted
          }}
        >
          <div 
            className="h-9 border-b flex items-center px-2 shrink-0"
            style={{ 
              backgroundColor: colors.background.active,
              borderColor: colors.border.subtle
            }}
          >
            {[
              { id: "description", label: "Description", icon: FileSpreadsheet },
              { id: "solutions", label: "Solutions", icon: Lightbulb },
              { id: "submissions", label: "Submissions", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "h-full px-4 flex items-center gap-2 text-[10px] font-bold transition-all relative",
                  activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <tab.icon className={cn("h-3 w-3", activeTab === tab.id ? "text-indigo-400" : "text-slate-600")} />
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="playgroundTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {activeQuestion ? (
                    <div className="space-y-6 pb-20">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-white">{activeQuestion.id}. {activeQuestion.title}</h2>
                          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                             <span>Solved</span>
                             <CheckCircle2 className="h-4 w-4" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={cn("rounded-full px-3 py-0.5 border-none font-bold capitalize", difficultyColor[activeQuestion.difficulty])}>
                            {activeQuestion.difficulty}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5">
                             <Hash className="h-3 w-3" /> Topics
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5">
                             <Database className="h-3 w-3" /> Companies
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5 ml-auto">
                             <Lightbulb className="h-3 w-3" /> Hint
                          </Button>
                        </div>
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 leading-relaxed text-[13px]">{activeQuestion.description}</p>
                      </div>

                      {/* Examples */}
                      <div className="space-y-6">
                         {[1, 2].map(i => (
                           <div key={i} className="space-y-3">
                              <h4 className="text-xs font-bold text-white">Example {i}:</h4>
                              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 font-mono text-[11px] space-y-1">
                                 <p><span className="text-slate-500 font-bold">Input:</span> <span className="text-slate-300">data_table_{i}, target = 10</span></p>
                                 <p><span className="text-slate-500 font-bold">Output:</span> <span className="text-slate-300">[1, 4]</span></p>
                                 <p><span className="text-slate-500 font-bold">Explanation:</span> <span className="text-slate-400 italic">Because rows at index 1 and 4 satisfy the criteria.</span></p>
                              </div>
                           </div>
                         ))}
                      </div>

                      {/* Bottom Footer */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-[#0F0F0F] flex items-center justify-between px-4">
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-500 hover:text-white cursor-pointer transition-colors">
                               <ThumbsUp className="h-4 w-4" />
                               <span className="text-[10px] font-bold">68.8K</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 hover:text-white cursor-pointer transition-colors">
                               <ThumbsDown className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 hover:text-white cursor-pointer transition-colors">
                               <MessageSquare className="h-4 w-4" />
                               <span className="text-[10px] font-bold">2K</span>
                            </div>
                            <Share2 className="h-4 w-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500">1731 Online</span>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
                      <BrainCircuit className="h-12 w-12 text-slate-800" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Awaiting Input</p>
                      <Button onClick={generateQuestions} disabled={isGeneratingQuestions} variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-white/10">
                        {isGeneratingQuestions ? "Generating..." : "Generate Challenges"}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "solutions" && (
                <motion.div key="solutions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-white">Community Solutions</h3>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={handleGetHelp}
                       disabled={isAiHelpLoading || !activeQuestion}
                       className="h-7 text-[10px] font-bold border-white/10 bg-white/5"
                     >
                        {isAiHelpLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2 text-indigo-400" />}
                        AI Solution
                     </Button>
                  </div>
                  
                  {aiHelp && (
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                       <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Tutor Insights</span>
                       </div>
                       <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{aiHelp}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                                   <User className="h-3 w-3 text-slate-500" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-300">Solution_{i * 123}</span>
                             </div>
                             <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {400 - i * 50}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {20 - i * 5}</span>
                             </div>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">This approach uses a hash map to achieve O(N) time complexity by storing the complements of each number as we iterate...</p>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "submissions" && (
                <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-lg font-bold text-white">My Submissions</h3>
                  <div className="space-y-2">
                     {[1, 2].map(i => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-emerald-400">Accepted</span>
                             <span className="text-[10px] text-slate-500 font-medium">April 25, 2026 20:45</span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] font-mono">
                             <span className="text-slate-300">45ms</span>
                             <span className="text-slate-500">|</span>
                             <span className="text-slate-300">12.4 MB</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                             View
                          </Button>
                       </div>
                     ))}
                     {questions.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center opacity-20">
                           <Clock className="h-8 w-8 mb-2" />
                           <p className="text-[10px] font-bold uppercase tracking-widest">No Submissions Yet</p>
                        </div>
                     )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: colors.background.main }}>
          {/* 1. Editor Header - Label Bar */}
          <div 
            className="h-9 border-b flex items-center px-4 shrink-0"
            style={{ 
              backgroundColor: colors.background.active,
              borderColor: colors.border.subtle
            }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold text-white">
              <Code2 className="h-4 w-4 text-emerald-400" />
              <span>Code</span>
            </div>
          </div>

          {/* 2. Editor Header - Controls Bar */}
          <div 
            className="h-9 border-b flex items-center justify-between px-4 shrink-0"
            style={{ 
              backgroundColor: colors.background.active,
              borderColor: colors.border.subtle
            }}
          >
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium hover:text-white cursor-pointer group">
                  <span>SQL</span>
                  <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-white" />
               </div>
               <div className="h-4 w-px bg-white/10" />
               <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium hover:text-white cursor-pointer group">
                  <Lock className="h-3 w-3 text-slate-500 group-hover:text-white" />
                  <span>Auto</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
               <AlignLeft className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               <Bookmark className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               <Braces className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               <RotateCcw className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               <Maximize2 className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
             <SQLEditor value={code} onChange={setCode} onRun={handleRun} height="100%" />
             
             {/* Editor Bottom Bar */}
             <div 
                className="absolute bottom-0 left-0 right-0 h-7 border-t flex items-center justify-between px-4 z-10"
                style={{ 
                  backgroundColor: colors.background.active,
                  borderColor: colors.border.subtle
                }}
             >
                <span className="text-[10px] font-medium text-slate-500">Saved</span>
                <span className="text-[10px] font-medium text-slate-500">Ln 1, Col 1</span>
             </div>
          </div>

          {/* Console / Test Results */}
          <div 
            className="h-[35%] flex flex-col min-h-0 border-t"
            style={{ 
              backgroundColor: colors.background.subtle,
              borderColor: colors.border.muted
            }}
          >
            <div 
              className="h-9 border-b flex items-center justify-between px-4"
              style={{ 
                backgroundColor: colors.background.active,
                borderColor: colors.border.subtle
              }}
            >
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 h-full border-b-2 border-emerald-500 px-1">
                   <CheckCircle2 className="h-3 w-3" />
                   Testcase
                </button>
                <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 h-full hover:text-slate-300 transition-colors">
                   <Terminal className="h-3 w-3" />
                   Test Result
                </button>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-600 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {queryResult ? <ResultsTable result={queryResult} /> : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Terminal className="h-10 w-10 text-slate-400 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Console Idle</p>
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
