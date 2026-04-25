"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/editor/results-table";
import { useAIChatStore } from "@/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseRealtime, type RealtimeSubmission } from "@/hooks/use-realtime";
import { authClient } from "@/lib/auth-client";
import {
  useSqlSandbox,
  problemToSandbox,
  DEFAULT_SANDBOX_TABLES,
  DEFAULT_SANDBOX_DATA,
} from "@/hooks/use-sql-sandbox";
import {
  ArrowLeft,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Send,
  Database,
  Terminal,
  List,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Flame,
  Clock,
  Settings,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Hash,
  Copy,
  RotateCcw,
  Maximize2,
  ChevronDown,
  Code2,
  AlignLeft,
  Bookmark,
  Braces,
  Lock,
  Users,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { QueryResult } from "@/types";
import { colors } from "@/lib/colors";
import { SubmissionHistory } from "@/components/arena/submission-history";
import { TestCasePanel } from "@/components/arena/test-case-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

function Hint({ 
  children, 
  text, 
  side = "top",
  align = "center"
}: { 
  children: React.ReactNode; 
  text: string; 
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        side={side} 
        align={align}
        className="bg-slate-900 text-slate-200 border border-white/10 px-2 py-1 text-[10px] font-bold shadow-xl"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  { ssr: false, loading: () => <div className="h-[300px] rounded-xl border border-slate-800 bg-slate-900/50 animate-pulse" /> }
);

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProblemData {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  schema_json: Record<string, string>;
  sample_data_json: Record<string, Record<string, unknown>[]>;
  tags: string[];
  likes_count: number;
  dislikes_count: number;
  solutions_count: number;
  comments_count: number;
}

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

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ArenaProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemSlug = params.problemSlug as string;
  const { togglePanel } = useAIChatStore();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();



  // Fetch problem from API
  const { data: problem, isLoading, error } = useQuery<ProblemData>({
    queryKey: ["problem", problemSlug],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${problemSlug}`);
      if (!res.ok) throw new Error("Problem not found");
      return res.json();
    },
  });

  // Fetch all problems for navigation (Prev/Next/Shuffle)
  const { data: allProblems } = useQuery<ProblemData[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await fetch("/api/problems");
      if (!res.ok) return [];
      return res.json();
    },
  });

  // --- Settings State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    lineNumbers: "on" as "on" | "off",
    wordWrap: "on" as "on" | "off",
    showTimer: true,
    theme: "datatrail-dark",
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("arena-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEditorSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<typeof editorSettings>) => {
    setEditorSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("arena-settings", JSON.stringify(updated));
      return updated;
    });
  };

  // ─── Timer & Popover State ─────────────────────────────────────────────
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timerMode, setTimerMode] = useState<"stopwatch" | "timer">("stopwatch");
  const [selectedLanguage, setSelectedLanguage] = useState("sql");
  const [activePopover, setActivePopover] = useState<"collaboration" | "timer" | "language" | null>(null);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleToggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const handleResetTimer = () => {
    setSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── Navigation ─────────────────────────────────────────────────────────
  const currentIndex = useMemo(() => {
    if (!allProblems || !problemSlug) return -1;
    return allProblems.findIndex((p) => p.slug === problemSlug);
  }, [allProblems, problemSlug]);

  const handlePrev = useCallback(() => {
    if (!allProblems || currentIndex <= 0) return;
    router.push(`/arena/${allProblems[currentIndex - 1].slug}`);
  }, [allProblems, currentIndex, router]);

  const handleNext = useCallback(() => {
    if (!allProblems || currentIndex === -1 || currentIndex >= allProblems.length - 1) return;
    router.push(`/arena/${allProblems[currentIndex + 1].slug}`);
  }, [allProblems, currentIndex, router]);

  const handleShuffle = useCallback(() => {
    if (!allProblems || allProblems.length < 2) return;
    let randomIndex = Math.floor(Math.random() * allProblems.length);
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * allProblems.length);
    }
    router.push(`/arena/${allProblems[randomIndex].slug}`);
  }, [allProblems, currentIndex, router]);

  // Realtime handlers
  const handleProblemChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["problem", problemSlug] });
  }, [queryClient, problemSlug]);

  const { onlineCount, realtimeSubmissions, setInitialSubmissions } = useSupabaseRealtime({
    problemId: problem?.id,
    problemSlug,
    userId: session?.user?.id,
    userName: session?.user?.name,
    onProblemChange: handleProblemChange,
  });

  // Seed submissions list on mount / when problem loads
  useEffect(() => {
    if (!problemSlug) return;
    let cancelled = false;
    fetch(`/api/problems/${problemSlug}/submissions`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setInitialSubmissions(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [problemSlug, setInitialSubmissions]);

  // Convert problem schema to sandbox format
  const { sandboxTables, sandboxData } = useMemo(() => {
    if (problem?.schema_json && problem?.sample_data_json) {
      const { tables, data } = problemToSandbox(
        problem.schema_json,
        problem.sample_data_json
      );
      return { sandboxTables: tables, sandboxData: data };
    }
    return { sandboxTables: DEFAULT_SANDBOX_TABLES, sandboxData: DEFAULT_SANDBOX_DATA };
  }, [problem]);

  // Initialize client-side SQL sandbox
  const { ready, runQuery } = useSqlSandbox(sandboxTables, sandboxData);

  const [code, setCode] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    status: string;
    error?: string;
  } | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintText, setHintText] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "solutions" | "submissions">("description");

  // Fetch Community Solutions
  const { data: solutions, refetch: refetchSolutions } = useQuery({
    queryKey: ["solutions", problemSlug],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${problemSlug}/solutions`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === "solutions",
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

  // ─── Run: Execute locally in sql.js sandbox ────────────────────────────
  const handleRun = useCallback(() => {
    if (!code.trim() || !ready) return;
    setLoading(true);
    setSubmitted(false);
    setSubmitResult(null);

    // Run in client-side sandbox
    const queryResult = runQuery(code.trim());
    setResult(queryResult);
    setLoading(false);
  }, [code, ready, runQuery]);

  // ─── Submit: Send to server for validation + logging ───────────────────
  const handleSubmit = useCallback(async () => {
    if (!code.trim() || !problem) return;
    setLoading(true);
    setSubmitted(false);
    setSubmitResult(null);
    setResult(null);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          query: code.trim(),
        }),
      });
      const data = await res.json();

      // Show the result table from server
      if (data.result) {
        const columns =
          Array.isArray(data.result) && data.result.length > 0
            ? Object.keys(data.result[0])
            : [];
        setResult({
          columns,
          rows: data.result || [],
          expected: data.expected || [],
          executionTimeMs: data.executionTime || 0,
          error: data.error,
        });
      } else if (data.error) {
        setResult({
          columns: [],
          rows: [],
          executionTimeMs: 0,
          error: typeof data.error === "string" ? data.error : JSON.stringify(data.error),
        });
      }

      setSubmitted(true);
      setSubmitResult({
        success: data.success || false,
        status: data.status || "error",
        error: data.error,
      });
    } catch {
      setResult({
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Failed to submit query. Check your connection.",
      });
      setSubmitted(true);
      setSubmitResult({ success: false, status: "error", error: "Connection failed" });
    } finally {
      setLoading(false);
    }
  }, [code, problem]);

  // ─── Hints: AI-powered progressive hints ───────────────────────────────
  const handleHint = useCallback(async () => {
    if (!problem) return;
    const nextLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(nextLevel);
    setHintLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          problem: problem.description,
          level: nextLevel,
        }),
      });
      const data = await res.json();
      setHintText(data.result || "No hint available");
    } catch {
      setHintText("Failed to get hint. Try again.");
    } finally {
      setHintLoading(false);
    }
  }, [problem, hintLevel]);

  // ─── Vote: Like or Dislike ─────────────────────────────────────────────
  const handleVote = useCallback(async (voteType: "like" | "dislike") => {
    if (!session?.user || !problem) return;
    try {
      const res = await fetch(`/api/problems/${problemSlug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType, userId: session.user.id }),
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["problem", problemSlug] });
      }
    } catch (err) {
      console.error("Voting error:", err);
    }
  }, [session?.user, problem, problemSlug, queryClient]);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied to clipboard!");
    }
  }, []);

  // Build sample data display from schema_json/sample_data_json
  const sampleTables = useMemo(() => {
    if (!problem?.sample_data_json) return [];
    return Object.entries(problem.sample_data_json).map(
      ([tableName, rows]) => {
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return {
          table: tableName,
          columns,
          rows: rows.map((row) => columns.map((col) => String(row[col] ?? ""))),
        };
      }
    );
  }, [problem?.sample_data_json]);

  const topicTag = useMemo(() => (problem?.tags && problem.tags[0]) || "sql", [problem?.tags]);

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

  // ─── Loading state ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <p className="text-slate-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  // ─── Not found ─────────────────────────────────────────────────────────
  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-black italic text-slate-700">404</h1>
        <p className="text-slate-500 font-medium tracking-tight">Problem not found</p>
        <Link href="/arena">
          <Button variant="outline" className="border-slate-800 mt-2">Back to Arena</Button>
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: colors.background.DEFAULT }}
    >
      {/* ─── Header ─── */}
      <header 
        className="h-12 border-b flex items-center justify-between px-4 shrink-0"
        style={{ 
          backgroundColor: colors.background.card,
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
            <Hint text="Previous Problem" side="bottom">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrev}
                disabled={!allProblems || currentIndex <= 0}
                className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Hint>
            <Hint text="Next Problem" side="bottom">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                disabled={!allProblems || currentIndex === -1 || currentIndex >= allProblems.length - 1}
                className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Hint>
            <Hint text="Shuffle Problem" side="bottom">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShuffle}
                className="h-7 w-7 rounded-md hover:bg-white/5 text-slate-500"
              >
                <Shuffle className="h-3.5 w-3.5" />
              </Button>
            </Hint>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
             <Hint text="Run Code (Ctrl + Enter)" side="bottom">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRun}
                  disabled={loading || !ready}
                  className="h-7 px-3 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/5 gap-2"
                >
                  {loading && !submitted ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-indigo-400 text-indigo-400" />}
                  Run
                </Button>
             </Hint>
             <Hint text="Submit Solution (Ctrl + Shift + Enter)" side="bottom">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-7 px-3 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2"
                >
                  {loading && submitted ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                  Submit
                </Button>
             </Hint>
          </div>
          
          <Hint text="AI Debugger" side="bottom">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:bg-indigo-500/10" onClick={togglePanel}>
              <Sparkles className="h-4 w-4" />
            </Button>
          </Hint>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="flex items-center gap-4 mr-4">
            <Hint text="Your Current Streak" side="bottom">
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 cursor-pointer">
                 <Flame className="h-4 w-4 text-amber-500" />
                 <span className="text-xs font-bold">{profile?.streak || 0}</span>
              </div>
            </Hint>
            
            {/* Timer Popover Trigger */}
            <div className="relative">
              <Hint text={isTimerRunning ? "Stopwatch Running" : "Stopwatch Paused"} side="bottom">
                <div 
                  onClick={() => setActivePopover(activePopover === "timer" ? null : "timer")}
                  className={cn(
                    "h-8 flex items-center gap-2.5 px-3 rounded-lg transition-all cursor-pointer",
                    activePopover === "timer" ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {editorSettings.showTimer && (
                    <>
                      <Clock className={cn("h-4 w-4", isTimerRunning ? "text-sky-400" : "")} />
                      <span className="text-xs font-bold font-mono">{formatTime(seconds)}</span>
                    </>
                  )}
                  {!editorSettings.showTimer && <Clock className="h-4 w-4 opacity-50" />}
                </div>
              </Hint>

              <AnimatePresence>
                {activePopover === "timer" && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActivePopover(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-5"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <button 
                          onClick={() => setTimerMode("stopwatch")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all",
                            timerMode === "stopwatch" ? "bg-white/5 border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.1)]" : "bg-transparent border-white/5 hover:bg-white/[0.02]"
                          )}
                        >
                          <Clock className={cn("h-7 w-7", timerMode === "stopwatch" ? "text-sky-400" : "text-slate-600")} />
                          <span className={cn("text-[11px] font-bold", timerMode === "stopwatch" ? "text-white" : "text-slate-600")}>Stopwatch</span>
                        </button>
                        <button 
                          onClick={() => setTimerMode("timer")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all",
                            timerMode === "timer" ? "bg-white/5 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-transparent border-white/5 hover:bg-white/[0.02]"
                          )}
                        >
                          <RotateCcw className={cn("h-7 w-7", timerMode === "timer" ? "text-amber-500" : "text-slate-600")} />
                          <span className={cn("text-[11px] font-bold", timerMode === "timer" ? "text-white" : "text-slate-600")}>Timer</span>
                        </button>
                      </div>
                      
                      <Button 
                        onClick={handleToggleTimer}
                        className="w-full bg-white hover:bg-slate-200 text-black font-black h-11 rounded-xl flex items-center justify-center gap-2 text-xs transition-transform active:scale-95"
                      >
                        {isTimerRunning ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                        {isTimerRunning ? "Reset Stopwatch" : "Start Stopwatch"}
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
            {/* Collaboration Popover Trigger */}
            <div className="relative">
              <Hint text="Live Collaboration" side="bottom">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActivePopover(activePopover === "collaboration" ? null : "collaboration")}
                  className={cn(
                    "h-8 gap-2 transition-colors",
                    activePopover === "collaboration" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-medium">Collaborate</span>
                  <span className="ml-1 bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {onlineCount}
                  </span>
                </Button>
              </Hint>

              <AnimatePresence>
                {activePopover === "collaboration" && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActivePopover(null)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-7"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          Collaboration <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-500 font-bold border border-white/10">Beta</span>
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Invite collaborators to code together on this problem! The collaboration can last up to 3 hours.
                      </p>
                      <Button 
                        onClick={handleShare}
                        className="w-full mt-8 bg-white hover:bg-slate-200 text-black font-black h-11 rounded-xl flex items-center justify-center gap-3 text-xs transition-transform active:scale-95"
                      >
                        <Link2 className="h-4 w-4" />
                        Create Link
                      </Button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400"
              onClick={() => setIsSettingsOpen(true)}
            >
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
            borderColor: colors.border.subtle
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
              { id: "description", label: "Description", icon: Terminal },
              { id: "solutions", label: "Solutions", icon: Lightbulb },
              { id: "submissions", label: "Submissions", icon: Clock },
            ].map((tab) => (
              <Hint text={tab.label} side="right">
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
                  {activeTab === tab.id && <motion.div layoutId="arenaTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                </button>
              </Hint>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="space-y-6 pb-20">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
                        {submitted && submitResult?.success && (
                          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                             <span>Solved</span>
                             <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 border-none font-bold capitalize", difficultyColor[problem.difficulty])}>
                          {problem.difficulty}
                        </Badge>
                        <Hint text="Explore Topics">
                          <Button variant="outline" size="sm" className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5">
                             <Hash className="h-3 w-3" /> Topics
                          </Button>
                        </Hint>
                        <Hint text="Target Companies">
                          <Button variant="outline" size="sm" className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5">
                             <Database className="h-3 w-3" /> Companies
                          </Button>
                        </Hint>
                        <Hint text="Get a Hint (Limit 3)">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleHint}
                            disabled={hintLoading || hintLevel >= 3}
                            className="h-6 rounded-full bg-white/5 border-white/10 text-[10px] text-slate-400 gap-1.5 ml-auto"
                          >
                             <Lightbulb className="h-3 w-3" /> {hintLoading ? "..." : `Hint (${hintLevel}/3)`}
                          </Button>
                        </Hint>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 leading-relaxed text-[13px]">{problem.description}</p>
                    </div>

                    {/* Hint Display */}
                    {hintText && (
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Hint {hintLevel}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed italic">{hintText}</p>
                      </div>
                    )}

                    {/* Sample Tables */}
                    <div className="space-y-6">
                       {sampleTables.map((dataset) => (
                          <div key={dataset.table} className="space-y-3">
                             <div className="flex items-center gap-2">
                                <Database className="h-3.5 w-3.5 text-slate-500" />
                                <h4 className="text-xs font-bold text-white">{dataset.table}</h4>
                             </div>
                             <div className="rounded-xl border border-white/5 overflow-hidden bg-white/[0.02]">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-white/5 bg-white/5">
                                        {dataset.columns.map((col) => (
                                          <th key={col} className="px-4 py-2.5 text-left font-mono font-bold text-slate-400 uppercase tracking-wider text-[9px]">
                                            {col}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {dataset.rows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                          {row.map((cell, cidx) => (
                                            <td key={cidx} className="px-4 py-2 font-mono text-slate-400 text-[10px]">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Bottom Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-[#0F0F0F] flex items-center justify-between px-4">
                       <div className="flex items-center gap-4">
                           <Hint text="Upvote Solution">
                             <div 
                               onClick={() => handleVote("like")}
                               className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors"
                             >
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-[10px] font-bold">{problem.likes_count || 0}</span>
                             </div>
                           </Hint>
                           <Hint text="Downvote Solution">
                             <div 
                               onClick={() => handleVote("dislike")}
                               className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                             >
                                <ThumbsDown className="h-4 w-4" />
                                <span className="text-[10px] font-bold">{problem.dislikes_count || 0}</span>
                             </div>
                           </Hint>
                           <Hint text="View Comments">
                             <div className="flex items-center gap-1.5 text-slate-500 hover:text-white cursor-pointer transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-[10px] font-bold">{problem.comments_count || 0}</span>
                             </div>
                           </Hint>
                           <Hint text="Share Problem">
                             <div 
                               onClick={handleShare}
                               className="flex items-center gap-1.5 text-slate-500 hover:text-white cursor-pointer transition-colors"
                             >
                                <Share2 className="h-4 w-4" />
                             </div>
                           </Hint>
                        </div>
                       <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] font-bold text-slate-500">{onlineCount} Online</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "solutions" && (
                <motion.div key="solutions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-white">Community Solutions</h3>
                     <Hint text="Let AI explain this solution">
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={togglePanel}
                         className="h-7 text-[10px] font-bold border-white/10 bg-white/5"
                       >
                          <Sparkles className="h-3 w-3 mr-2 text-indigo-400" /> AI Explainer
                       </Button>
                     </Hint>
                  </div>
                  <div className="space-y-4">
                     {solutions && solutions.length > 0 ? (
                       solutions.map((sol: any) => (
                         <div key={sol.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                               <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                     {sol.user?.image ? (
                                       <img src={sol.user.image} alt={sol.user.name} className="h-full w-full object-cover" />
                                     ) : (
                                       <User className="h-3 w-3 text-slate-500" />
                                     )}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-300">{sol.user?.name || "Anonymous"}</span>
                               </div>
                               <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {sol.likes_count}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(sol.created_at).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">{sol.title}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{sol.content}</p>
                         </div>
                       ))
                     ) : (
                        <div className="h-40 flex flex-col items-center justify-center opacity-20">
                           <Lightbulb className="h-8 w-8 mb-2" />
                           <p className="text-[10px] font-bold uppercase tracking-widest">No Solutions Yet</p>
                        </div>
                     )}
                  </div>
                </motion.div>
              )}

              {activeTab === "submissions" && (
                <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Your Submissions</h3>
                    <div className="flex items-center gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 text-[10px] font-bold text-slate-500 hover:text-white"
                         onClick={() => queryClient.invalidateQueries({ queryKey: ["submissions", "history", problemSlug] })}
                       >
                          <RotateCcw className="h-3 w-3 mr-2" /> Refresh
                       </Button>
                    </div>
                  </div>
                  
                  <SubmissionHistory 
                    problemSlug={problemSlug} 
                    onSelect={(prevCode) => setCode(prevCode)} 
                  />

                  {realtimeSubmissions.length > 0 && (
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-400">Live Feed (Global)</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Realtime</span>
                        </div>
                      </div>
                      <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                         {realtimeSubmissions.slice(0, 5).map((sub) => (
                           <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.01] border border-white/5">
                              <span className={cn("text-[10px] font-bold", sub.status === "accepted" ? "text-emerald-400" : "text-rose-400")}>
                                {sub.status}
                              </span>
                              <span className="text-[9px] text-slate-600 font-mono">
                                {sub.user_id.slice(0, 6)}
                              </span>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right */}
        <div 
          className="flex-1 flex flex-col min-h-0"
          style={{ backgroundColor: colors.background.DEFAULT }}
        >
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
               <div className="relative">
                 <Hint text="Select Language" side="bottom" align="start">
                   <div 
                     onClick={() => setActivePopover(activePopover === "language" ? null : "language")}
                     className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium hover:text-white cursor-pointer group"
                   >
                      <span className="uppercase">{selectedLanguage}</span>
                      <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-white" />
                   </div>
                 </Hint>

                 <AnimatePresence>
                   {activePopover === "language" && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setActivePopover(null)} />
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-2"
                       >
                         {[
                           { id: "sql", name: "SQL", icon: Database },
                           { id: "python", name: "Python", icon: Code2 },
                           { id: "r", name: "R Language", icon: Terminal },
                         ].map((lang) => (
                           <button
                             key={lang.id}
                             onClick={() => {
                               setSelectedLanguage(lang.id);
                               setActivePopover(null);
                             }}
                             className={cn(
                               "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                               selectedLanguage === lang.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                             )}
                           >
                             <lang.icon className={cn("h-3.5 w-3.5", selectedLanguage === lang.id ? "text-indigo-400" : "text-slate-600")} />
                             {lang.name}
                           </button>
                         ))}
                       </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>
               <div className="h-4 w-px bg-white/10" />
               <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium hover:text-white cursor-pointer group">
                  <Lock className="h-3 w-3 text-slate-500 group-hover:text-white" />
                  <Hint text="Auto-run & Save" side="bottom">
                    <span>Auto</span>
                  </Hint>
               </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
               <Hint text="Format Code">
                 <AlignLeft className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               </Hint>
               <Hint text="Bookmark Problem">
                 <Bookmark className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               </Hint>
               <Hint text="Code Snippets">
                 <Braces className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               </Hint>
               <Hint text="Reset Code">
                 <RotateCcw className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               </Hint>
               <Hint text="Full Screen">
                 <Maximize2 className="h-3.5 w-3.5 hover:text-white cursor-pointer transition-colors" />
               </Hint>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden min-h-0">
             <SQLEditor 
               value={code} 
               onChange={setCode} 
               onRun={handleRun} 
               height="100%" 
               language={selectedLanguage} 
               fontSize={editorSettings.fontSize}
               tabSize={editorSettings.tabSize}
               lineNumbers={editorSettings.lineNumbers}
               wordWrap={editorSettings.wordWrap}
             />
             
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
                <Hint text="Edit Testcases" side="top">
                  <button 
                    onClick={() => setSubmitted(false)}
                    className={cn(
                      "flex items-center gap-2 text-[10px] font-bold h-full px-1 border-b-2 transition-colors",
                      !submitted ? "text-emerald-400 border-emerald-500" : "text-slate-500 border-transparent hover:text-slate-300"
                    )}
                  >
                     <CheckCircle2 className="h-3 w-3" />
                     Testcase
                  </button>
                </Hint>
                <Hint text="View Execution Results" side="top">
                  <button 
                    onClick={() => setSubmitted(true)}
                    className={cn(
                      "flex items-center gap-2 text-[10px] font-bold h-full px-1 border-b-2 transition-colors",
                      submitted ? "text-emerald-400 border-emerald-500" : "text-slate-500 border-transparent hover:text-slate-300"
                    )}
                  >
                     <Terminal className="h-3 w-3" />
                     Test Result
                  </button>
                </Hint>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-600 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {submitted && submitResult ? (
                <div className="space-y-4">
                   <div className={cn("p-4 rounded-xl flex items-center gap-4", submitResult.success ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-rose-500/5 border border-rose-500/10")}>
                      {submitResult.success ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-rose-400" />
                      )}
                      <div>
                         <p className={cn("font-bold", submitResult.success ? "text-emerald-400" : "text-rose-400")}>
                           {submitResult.success ? "Accepted" : "Incorrect"}
                         </p>
                         <p className="text-[10px] text-slate-500">Runtime: {result?.executionTimeMs || 0} ms</p>
                      </div>
                   </div>
                   {result && <ResultsTable result={result} />}
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                     <span>Query Output</span>
                     <span>{result.executionTimeMs}ms</span>
                  </div>
                  <ResultsTable result={result} />
                </div>
              ) : (
                <TestCasePanel 
                  sampleTables={sampleTables} 
                  expectedOutput={problem.expected_output_json} 
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
        settings={editorSettings} 
        onUpdate={updateSettings} 
      />
    </div>
  );
}

function SettingsModal({ 
  open, 
  onOpenChange, 
  settings, 
  onUpdate 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  settings: any; 
  onUpdate: (s: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#0F0F0F] border-white/10 text-white p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            Editor Settings
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-[11px] font-medium uppercase tracking-widest mt-1">
            Global Workspace Configuration
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Editor Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <Terminal className="h-3 w-3" />
               <span>Editor Experience</span>
            </div>
            
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Font Size</Label>
                  <p className="text-[10px] text-slate-500">Scale the code text visibility</p>
                </div>
                <div className="w-32">
                   <Select 
                     value={settings.fontSize.toString()} 
                     onValueChange={(v) => onUpdate({ fontSize: parseInt(v) })}
                   >
                     <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-[#1A1A1A] border-white/10">
                       {[12, 13, 14, 15, 16, 18, 20].map(s => (
                         <SelectItem key={s} value={s.toString()} className="text-xs font-medium focus:bg-indigo-500">{s}px</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Indentation</Label>
                  <p className="text-[10px] text-slate-500">Spacing for nested SQL blocks</p>
                </div>
                <div className="w-32">
                   <Select 
                     value={settings.tabSize.toString()} 
                     onValueChange={(v) => onUpdate({ tabSize: parseInt(v) })}
                   >
                     <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-[#1A1A1A] border-white/10">
                       {[2, 4, 8].map(s => (
                         <SelectItem key={s} value={s.toString()} className="text-xs font-medium focus:bg-indigo-500">{s} Spaces</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Line Numbers</Label>
                  <p className="text-[10px] text-slate-500">Display gutter line references</p>
                </div>
                <Switch 
                  checked={settings.lineNumbers === "on"} 
                  onCheckedChange={(checked) => onUpdate({ lineNumbers: checked ? "on" : "off" })}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Interface Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
               <Clock className="h-3 w-3" />
               <span>Interface & Productivity</span>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Duration Timer</Label>
                  <p className="text-[10px] text-slate-500">Track time spent on problem</p>
                </div>
                <Switch 
                  checked={settings.showTimer} 
                  onCheckedChange={(checked) => onUpdate({ showTimer: checked })}
                />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="bg-white hover:bg-slate-200 text-black text-[10px] font-black uppercase tracking-widest px-10 h-9 rounded-lg transition-transform active:scale-95 shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
            Close Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
