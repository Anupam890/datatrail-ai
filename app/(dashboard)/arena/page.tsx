"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Swords,
  Target,
  Flame,
  Trophy,
  Sparkles,
  FlaskConical,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Filter,
  Bookmark,
  Wand2,
  Table2,
  Terminal,
  ChevronRight,
  Zap,
  Hash,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

const difficultyConfig = {
  easy: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    pips: 1,
    label: "JUNIOR",
    dot: "bg-emerald-500",
    hex: "#10b981",
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    pips: 2,
    label: "SENIOR",
    dot: "bg-amber-500",
    hex: "#f59e0b",
  },
  hard: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    pips: 3,
    label: "STAFF",
    dot: "bg-rose-500",
    hex: "#f43f5e",
  },
};

const topicConfig: Record<
  string,
  {
    title: string;
    icon: any;
    description: string;
    longDescription: string;
    color: string;
    bg: string;
    border: string;
    gradient: string;
    glowColor: string;
    accentHex: string;
  }
> = {
  sql: {
    title: "SQL ARENA",
    icon: DatabaseIcon,
    description: "Production-grade database challenges.",
    longDescription:
      "Master SELECT, JOIN, subqueries, window functions, CTEs, and complex query optimization through real-world production scenarios.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    gradient: "from-indigo-600/20 via-indigo-500/5 to-transparent",
    glowColor: "rgba(99, 102, 241, 0.15)",
    accentHex: "#6366f1",
  },
  pandas: {
    title: "PANDAS LAB",
    icon: Table2,
    description: "Data manipulation & analysis.",
    longDescription:
      "DataFrames, Series operations, groupby, merge, pivot tables, and advanced data wrangling techniques for analytics pipelines.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-600/20 via-emerald-500/5 to-transparent",
    glowColor: "rgba(16, 185, 129, 0.15)",
    accentHex: "#10b981",
  },
  python: {
    title: "PYTHON CORE",
    icon: Terminal,
    description: "Algorithmic & data challenges.",
    longDescription:
      "Data structures, algorithms, OOP patterns, functional programming, and Pythonic problem-solving for data engineering roles.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    gradient: "from-amber-600/20 via-amber-500/5 to-transparent",
    glowColor: "rgba(245, 158, 11, 0.15)",
    accentHex: "#f59e0b",
  },
};

function DifficultyPips({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard";
}) {
  const config = difficultyConfig[difficulty];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((p) => (
        <div
          key={p}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-all duration-500",
            p <= config.pips
              ? cn(
                  config.color.replace("text-", "bg-"),
                  "shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
                )
              : "bg-slate-800"
          )}
          style={
            p <= config.pips
              ? {
                  boxShadow: `0 0 10px ${config.hex}66`,
                }
              : {}
          }
        />
      ))}
    </div>
  );
}

// ─── Topic Hub Card ─────────────────────────────────────────────────────────

function TopicCard({
  topicKey,
  problems,
  index,
  onClick,
}: {
  topicKey: string;
  problems: Problem[];
  index: number;
  onClick: () => void;
}) {
  const config = topicConfig[topicKey];
  const easyCount = problems.filter((p) => p.difficulty === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "hard").length;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3 + index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any,
      }}
    >
      <SpotlightCard
        spotlightColor={config.glowColor}
        className={cn(
          "group !p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5 cursor-pointer transition-all duration-500 hover:border-white/10"
        )}
      >
        <div onClick={onClick} className="p-8 md:p-10 space-y-8">
          {/* Topic gradient accent */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-40 rounded-t-[2.5rem] bg-gradient-to-b opacity-60 pointer-events-none",
              config.gradient
            )}
          />

          {/* Header */}
          <div className="relative flex items-start justify-between">
            <div className="space-y-5">
              <div
                className={cn(
                  "h-16 w-16 rounded-[1.5rem] flex items-center justify-center border group-hover:scale-110 transition-transform duration-500",
                  config.bg,
                  config.border
                )}
              >
                <Icon className={cn("h-8 w-8", config.color)} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase group-hover:text-white transition-colors">
                  {config.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                  {config.longDescription}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-white/5 border border-white/5"
              )}
            >
              <div className="text-center">
                <p className="text-3xl font-black italic tracking-tighter">
                  {problems.length}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  Problems
                </p>
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="relative grid grid-cols-3 gap-3">
            {[
              {
                label: "Junior",
                count: easyCount,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
              },
              {
                label: "Senior",
                count: mediumCount,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
              },
              {
                label: "Staff",
                count: hardCount,
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                border: "border-rose-500/20",
              },
            ].map((level) => (
              <div
                key={level.label}
                className={cn(
                  "p-3 rounded-2xl border text-center",
                  level.bg,
                  level.border
                )}
              >
                <p className="text-xl font-black italic tracking-tighter">
                  {level.count}
                </p>
                <p
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-widest",
                    level.color
                  )}
                >
                  {level.label}
                </p>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="relative pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className={cn("h-4 w-4", config.color)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {problems.length} Challenges Ready
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-xs font-bold group-hover:translate-x-1 transition-transform",
                config.color
              )}
            >
              ENTER
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ArenaPage() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const queryClient = useQueryClient();
  const router = useRouter();

  const generateProblem = useMutation({
    mutationFn: async () => {
      const difficulties = ["easy", "medium", "hard"];
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const res = await fetch("/api/problems/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: randomDifficulty }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      if (data.slug) {
        router.push(`/arena/${data.slug}`);
      }
    },
  });

  const { data: problems = [], isLoading } = useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await fetch("/api/problems");
      if (!res.ok) throw new Error("Failed to fetch problems");
      return res.json();
    },
  });

  const { data: bookmarks = [] } = useQuery<{ problem_id: string }[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch("/api/bookmarks");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const bookmarkedIds = new Set(bookmarks.map((b) => b.problem_id));

  const toggleBookmark = useMutation({
    mutationFn: async (problemId: string) => {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId }),
      });
      if (!res.ok) throw new Error("Failed to toggle bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  // Group problems by topic
  const getTopicProblems = (topicKey: string) => {
    return problems.filter((p) => {
      if (topicKey === "sql") {
        return !p.tags.includes("pandas") && !p.tags.includes("python");
      }
      return p.tags.includes(topicKey);
    });
  };

  // For the active topic view — apply search + difficulty filters
  const activeTopicProblems = activeTopic
    ? getTopicProblems(activeTopic).filter((p) => {
        const matchSearch = p.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchDifficulty =
          difficulty === "all" || p.difficulty === difficulty;
        return matchSearch && matchDifficulty;
      })
    : [];

  const activeConfig = activeTopic ? topicConfig[activeTopic] : null;
  const ActiveIcon = activeConfig?.icon ?? null;

  const easyCount = problems.filter((p) => p.difficulty === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "hard").length;

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-12">
        <AnimatePresence mode="wait">
          {!activeTopic ? (
            // ──────────── TOPIC HUB VIEW ────────────
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
                  >
                    <Swords className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                      Battlegrounds
                    </span>
                  </motion.div>

                  <div className="space-y-2">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1] as any,
                      }}
                      className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
                    >
                      THE{" "}
                      <span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                        ARENA
                      </span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
                    >
                      Choose your battleground. Master data skills through
                      real-world production challenges.
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link href="/arena/playground">
                    <Button
                      size="lg"
                      className="group relative gap-3 bg-white text-black hover:bg-slate-100 rounded-2xl h-14 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FlaskConical className="h-5 w-5" />
                      SQL Sandbox
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    onClick={() => generateProblem.mutate()}
                    disabled={generateProblem.isPending}
                    className="group relative gap-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-2xl h-14 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {generateProblem.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Wand2 className="h-5 w-5" />
                    )}
                    {generateProblem.isPending
                      ? "Generating..."
                      : "AI Generate"}
                  </Button>
                </motion.div>
              </div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: "Active Problems",
                    value: problems.length,
                    icon: Target,
                    color: "text-indigo-400",
                    sub: "Production Challenges",
                  },
                  {
                    label: "Level: Junior",
                    value: easyCount,
                    icon: Sparkles,
                    color: "text-emerald-400",
                    sub: "Fundamentals",
                  },
                  {
                    label: "Level: Senior",
                    value: mediumCount,
                    icon: Flame,
                    color: "text-amber-400",
                    sub: "Architecture",
                  },
                  {
                    label: "Level: Staff",
                    value: hardCount,
                    icon: Trophy,
                    color: "text-rose-400",
                    sub: "System Design",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="glass-premium p-6 rounded-[2rem] group hover:bg-slate-900/50 transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={cn(
                          "p-3 rounded-2xl bg-white/5",
                          stat.color
                        )}
                      >
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={cn(
                            "h-full",
                            stat.color.replace("text-", "bg-")
                          )}
                          style={{ width: "60%" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-black italic tracking-tighter">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {stat.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Topic Cards Grid */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <Hash className="h-4 w-4 text-slate-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Choose your discipline
                  </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(topicConfig).map((topicKey, i) => {
                    const topicProblems = getTopicProblems(topicKey);
                    return (
                      <TopicCard
                        key={topicKey}
                        topicKey={topicKey}
                        problems={topicProblems}
                        index={i}
                        onClick={() => {
                          setActiveTopic(topicKey);
                          setSearch("");
                          setDifficulty("all");
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="py-24 flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 h-12 w-12 bg-indigo-500/20 blur-xl" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">
                    Loading Problems...
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            // ──────────── TOPIC QUESTIONS VIEW ────────────
            <motion.div
              key={`topic-${activeTopic}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className="space-y-10"
            >
              {/* Back + Topic Header */}
              <div className="space-y-6">
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveTopic(null)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    All Topics
                  </span>
                </motion.button>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div
                      className={cn(
                        "h-20 w-20 rounded-[1.5rem] flex items-center justify-center border",
                        activeConfig?.bg,
                        activeConfig?.border
                      )}
                    >
                      {ActiveIcon && (
                        <ActiveIcon
                          className={cn("h-10 w-10", activeConfig?.color)}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] italic uppercase">
                        {activeConfig?.title}
                      </h1>
                      <p className="text-slate-400 text-lg font-medium tracking-tight">
                        {activeConfig?.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/arena/playground">
                      <Button
                        size="lg"
                        className="group relative gap-3 bg-white text-black hover:bg-slate-100 rounded-2xl h-14 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <FlaskConical className="h-5 w-5" />
                        SQL Sandbox
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      onClick={() => generateProblem.mutate()}
                      disabled={generateProblem.isPending}
                      className="group relative gap-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-2xl h-14 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {generateProblem.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Wand2 className="h-5 w-5" />
                      )}
                      {generateProblem.isPending
                        ? "Generating..."
                        : "AI Generate"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Controls Hub */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col md:flex-row gap-4 p-2 glass-premium rounded-[2.5rem]"
              >
                <div className="relative flex-1 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                  <Input
                    placeholder="Search challenges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none h-16 pl-16 pr-6 text-base font-medium focus:ring-0 placeholder:text-slate-600"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 shrink-0">
                  <div className="h-12 w-px bg-slate-800 hidden md:block mx-2" />
                  <Select
                    value={difficulty}
                    onValueChange={(v) => setDifficulty(v ?? "all")}
                  >
                    <SelectTrigger className="w-[160px] h-12 bg-white/5 border-white/5 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                      <SelectValue placeholder="COMPLEXITY" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0F19] border-slate-800 rounded-2xl">
                      <SelectItem value="all">ALL LEVELS</SelectItem>
                      <SelectItem value="easy">JUNIOR</SelectItem>
                      <SelectItem value="medium">SENIOR</SelectItem>
                      <SelectItem value="hard">STAFF</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-2xl hover:bg-white/5 text-slate-500"
                    onClick={() => {
                      setSearch("");
                      setDifficulty("all");
                    }}
                  >
                    <Filter className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Difficulty quick-filter pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 flex-wrap"
              >
                {(
                  ["all", "easy", "medium", "hard"] as const
                ).map((d) => {
                  const count =
                    d === "all"
                      ? getTopicProblems(activeTopic).length
                      : getTopicProblems(activeTopic).filter(
                          (p) => p.difficulty === d
                        ).length;
                  const isActive = difficulty === d;
                  const pillColor =
                    d === "easy"
                      ? "emerald"
                      : d === "medium"
                      ? "amber"
                      : d === "hard"
                      ? "rose"
                      : "slate";
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                        isActive
                          ? d === "all"
                            ? "bg-white/10 border-white/20 text-white"
                            : `bg-${pillColor}-500/10 border-${pillColor}-500/30 text-${pillColor}-400`
                          : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                      )}
                    >
                      {d === "all" ? "ALL" : difficultyConfig[d].label}{" "}
                      <span className="ml-1.5 text-slate-600">{count}</span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Problems List */}
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                  {activeTopicProblems.map((problem, i) => (
                    <motion.div
                      key={problem.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: [0.16, 1, 0.3, 1] as any,
                      }}
                    >
                      <Link href={`/arena/${problem.slug}`}>
                        <SpotlightCard
                          spotlightColor={activeConfig?.glowColor}
                          className="group h-full !p-0 rounded-[2rem] bg-slate-900/40 border-white/5 hover:border-white/10 transition-all duration-500"
                        >
                          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                            <div
                              className={cn(
                                "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border",
                                activeConfig?.bg,
                                activeConfig?.border
                              )}
                            >
                              {ActiveIcon && (
                                <ActiveIcon
                                  className={cn(
                                    "h-6 w-6",
                                    activeConfig?.color
                                  )}
                                />
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <h3 className="text-xl md:text-2xl font-black italic tracking-tighter group-hover:text-indigo-400 transition-colors uppercase">
                                    {problem.title}
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    {problem.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1 rounded-lg bg-white/5 border border-white/5"
                                      >
                                        {tag.replace("-", " ")}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <DifficultyPips
                                    difficulty={problem.difficulty}
                                  />
                                  <div className="hidden md:flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "h-2 w-2 rounded-full animate-pulse",
                                        difficultyConfig[problem.difficulty].dot
                                      )}
                                    />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                      {difficultyConfig[problem.difficulty].label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="md:border-l border-white/5 md:pl-8 flex items-center gap-4">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleBookmark.mutate(problem.id);
                                }}
                                className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                                title={
                                  bookmarkedIds.has(problem.id)
                                    ? "Remove bookmark"
                                    : "Add bookmark"
                                }
                              >
                                <Bookmark
                                  className={cn(
                                    "h-4 w-4 transition-colors",
                                    bookmarkedIds.has(problem.id)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-600 hover:text-slate-400"
                                  )}
                                />
                              </button>
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 text-xs font-bold group-hover:translate-x-1 transition-transform",
                                  activeConfig?.color
                                )}
                              >
                                SOLVE NOW{" "}
                                <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {!isLoading && activeTopicProblems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 text-center space-y-6"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full" />
                    <Search className="h-16 w-16 text-slate-700 relative z-10 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                      No problems found
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Try adjusting your filters or search query to find
                      more challenges.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setDifficulty("all");
                    }}
                    className="rounded-xl border-slate-800"
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && !activeTopic && (
          <div className="py-24 flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 bg-indigo-500/20 blur-xl" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">
              Loading Problems...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
