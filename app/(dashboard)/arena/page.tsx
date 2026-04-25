"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  CheckCircle2,
  Circle,
  Swords,
  Target,
  Flame,
  Trophy,
  Sparkles,
  FlaskConical,
  Loader2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    pips: 2,
  },
  hard: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    pips: 3,
  },
};

function DifficultyPips({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) {
  const config = difficultyConfig[difficulty];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((p) => (
        <div
          key={p}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-all duration-500",
            p <= config.pips 
              ? cn(config.color.replace("text-", "bg-"), "shadow-[0_0_8px_rgba(var(--color-primary),0.5)]") 
              : "bg-slate-800"
          )}
          style={p <= config.pips ? { 
            boxShadow: `0 0 10px ${difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#f59e0b' : '#f43f5e'}66` 
          } : {}}
        />
      ))}
    </div>
  );
}

export default function ArenaPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");

  const { data: problems = [], isLoading } = useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      const res = await fetch("/api/problems");
      if (!res.ok) throw new Error("Failed to fetch problems");
      return res.json();
    },
  });

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficulty === "all" || p.difficulty === difficulty;
    const matchTopic =
      topic === "all" || (p.tags && p.tags.some((t) => t === topic));
    return matchSearch && matchDifficulty && matchTopic;
  });

  const easyCount = problems.filter((p) => p.difficulty === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "hard").length;

  const allTopics = Array.from(
    new Set(problems.flatMap((p) => p.tags || []))
  ).sort();

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
            >
              <Swords className="h-4 w-4 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Battlegrounds</span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
              >
                THE <span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">ARENA</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
              >
                Master SQL by solving real-world production challenges. From fintech leaks to e-commerce scaling.
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
              <Button size="lg" className="group relative gap-3 bg-white text-black hover:bg-slate-100 rounded-2xl h-14 px-8 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                <FlaskConical className="h-5 w-5" />
                SQL Sandbox
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats & Filters Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: "Active Nodes", value: problems.length, icon: Target, color: "text-indigo-400", sub: "Production Challenges" },
              { label: "Level: Junior", value: easyCount, icon: Sparkles, color: "text-emerald-400", sub: "Fundamentals" },
              { label: "Level: Senior", value: mediumCount, icon: Flame, color: "text-amber-400", sub: "Architecture" },
              { label: "Level: Staff", value: hardCount, icon: Trophy, color: "text-rose-400", sub: "System Design" },
            ].map((stat, i) => (
              <div key={i} className="glass-premium p-6 rounded-[2rem] group hover:bg-slate-900/50 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                    <div className={cn("h-full", stat.color.replace("text-", "bg-"))} style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                  <p className="text-4xl font-black italic tracking-tighter">{stat.value}</p>
                  <p className="text-[11px] text-slate-600 font-medium">{stat.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Controls Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-12 flex flex-col md:flex-row gap-4 p-2 glass-premium rounded-[2.5rem]"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Query challenges by title or metadata..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none h-16 pl-16 pr-6 text-base font-medium focus:ring-0 placeholder:text-slate-600"
              />
            </div>
            
            <div className="flex items-center gap-2 p-2 shrink-0">
              <div className="h-12 w-px bg-slate-800 hidden md:block mx-2" />
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "all")}>
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
              
              <Select value={topic} onValueChange={(v) => setTopic(v ?? "all")}>
                <SelectTrigger className="w-[180px] h-12 bg-white/5 border-white/5 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                  <SelectValue placeholder="SYSTEM TYPE" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B0F19] border-slate-800 rounded-2xl">
                  <SelectItem value="all">ALL SYSTEMS</SelectItem>
                  {allTopics.map((t) => (
                    <SelectItem key={t} value={t} className="uppercase">
                      {t.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white/5 text-slate-500">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((problem, i) => (
              <motion.div
                key={problem.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <Link href={`/arena/${problem.slug}`}>
                  <SpotlightCard className="group h-full !p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                    <div className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <DatabaseIcon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <DifficultyPips difficulty={problem.difficulty} />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-indigo-400 transition-colors uppercase">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                              {tag.replace("-", " ")}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          ENTER NODE <ArrowRight className="h-3 w-3" />
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
        {!isLoading && filtered.length === 0 && (
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
              <h3 className="text-2xl font-bold tracking-tight">No nodes found in this sector</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search query to find more challenges.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setSearch(""); setDifficulty("all"); setTopic("all"); }}
              className="rounded-xl border-slate-800"
            >
              Reset Protocols
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 bg-indigo-500/20 blur-xl" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">Scanning Neural Network...</p>
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
