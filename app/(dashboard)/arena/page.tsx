"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

const difficultyColor = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const difficultyDot = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-rose-500",
};

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

  // Collect unique topic tags for the filter
  const allTopics = Array.from(
    new Set(problems.flatMap((p) => p.tags || []))
  ).sort();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-8 md:py-12 px-4 md:px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[15%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[25%] h-[25%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
            >
              <Swords className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">SQL Challenges</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic"
            >
              THE ARENA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-xl text-lg"
            >
              Sharpen your SQL skills with curated challenges across difficulty levels and topics.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="shrink-0"
          >
            <Link href="/arena/playground">
              <Button className="gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-5 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30">
                <FlaskConical className="h-4 w-4" />
                Playground
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Problems", value: problems.length.toString(), icon: Target, color: "text-indigo-500", detail: `${filtered.length} shown` },
            { label: "Easy", value: easyCount.toString(), icon: Sparkles, color: "text-emerald-500", detail: "beginner friendly" },
            { label: "Medium", value: mediumCount.toString(), icon: Flame, color: "text-amber-500", detail: "intermediate" },
            { label: "Hard", value: hardCount.toString(), icon: Trophy, color: "text-rose-500", detail: "advanced" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-black italic tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{stat.detail}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color} opacity-30`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900/50 border-slate-800 h-12 pl-12 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "all")}>
            <SelectTrigger className="w-full sm:w-[160px] h-12 bg-slate-900/50 border-slate-800 rounded-2xl">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={topic} onValueChange={(v) => setTopic(v ?? "all")}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-slate-900/50 border-slate-800 rounded-2xl">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {allTopics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Problem List */}
        {!isLoading && (
          <div className="space-y-3">
            {filtered.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
              >
                <Link href={`/arena/${problem.slug}`}>
                  <Card className="bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all duration-300 cursor-pointer group">
                    <CardContent className="flex items-center gap-4 p-4 md:p-5">
                      {/* Status icon */}
                      <div className="shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                          <Circle className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
                      </div>

                      {/* Problem info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-sm font-semibold group-hover:text-white transition-colors truncate">
                            {problem.title}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 shrink-0">
                        {problem.tags && problem.tags[0] && (
                          <Badge variant="outline" className="text-[10px] capitalize border-slate-800 text-slate-400 hidden sm:inline-flex">
                            {problem.tags[0].replace("-", " ")}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] gap-1.5 ${difficultyColor[problem.difficulty]}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot[problem.difficulty]}`} />
                          {problem.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {filtered.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="bg-slate-900/30 border-slate-800/50">
                  <CardContent className="p-12 text-center space-y-3">
                    <Search className="h-8 w-8 text-slate-700 mx-auto" />
                    <p className="text-slate-500 font-medium">
                      {problems.length === 0 ? "No problems found. Seed the database with problems." : "No problems match your filters"}
                    </p>
                    <p className="text-xs text-slate-600">Try adjusting your search or filter criteria</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
