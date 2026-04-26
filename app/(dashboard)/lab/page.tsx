"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Database,
  GitMerge,
  Filter,
  Calculator,
  Layers,
  BarChart3,
  LayoutGrid,
  Wrench,
  Code2,
  Shield,
  PenLine,
  Sparkles,
  ChevronDown,
  Circle,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useLabStore } from "@/store/use-lab-store";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
}

interface Track {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  color_key: string;
  sort_order: number;
  lessons: Lesson[];
  lessonCount: number;
}

interface Progress {
  lesson_slug: string;
  completed_at: string;
}

// ─── Icon & Color Maps ───────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Database,
  PenLine,
  Filter,
  BarChart3,
  GitMerge,
  Layers,
  LayoutGrid,
  Wrench,
  Code2,
  Shield,
};

const colorMap: Record<string, { text: string; bg: string; border: string; ring: string; shadow: string }> = {
  basics: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "stroke-emerald-500", shadow: "shadow-emerald-500/20" },
  modify: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", ring: "stroke-cyan-500", shadow: "shadow-cyan-500/20" },
  filter: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "stroke-orange-500", shadow: "shadow-orange-500/20" },
  aggregate: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", ring: "stroke-amber-500", shadow: "shadow-amber-500/20" },
  joins: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", ring: "stroke-blue-500", shadow: "shadow-blue-500/20" },
  subqueries: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", ring: "stroke-purple-500", shadow: "shadow-purple-500/20" },
  window: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", ring: "stroke-rose-500", shadow: "shadow-rose-500/20" },
  design: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", ring: "stroke-teal-500", shadow: "shadow-teal-500/20" },
  functions: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", ring: "stroke-pink-500", shadow: "shadow-pink-500/20" },
  advanced: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", ring: "stroke-indigo-500", shadow: "shadow-indigo-500/20" },
};

const categories = [
  { value: "all", label: "All Modules" },
  { value: "basics", label: "Basics" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

// ─── Circular Progress ─────────────────────────────────────────────────────

function CircularProgress({ percentage, color, size = 64 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-slate-800/50" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("fill-none", color)}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black italic tracking-tighter text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

// ─── Track Card ────────────────────────────────────────────────────────────

function TrackCard({
  track,
  index,
  completedSlugs,
}: {
  track: Track;
  index: number;
  completedSlugs: Set<string>;
}) {
  const completedCount = track.lessons.filter((l) => completedSlugs.has(l.slug)).length;
  const progress = track.lessonCount > 0 ? (completedCount / track.lessonCount) * 100 : 0;
  const isComplete = completedCount === track.lessonCount && track.lessonCount > 0;
  const Icon = iconMap[track.icon] || BookOpen;
  const colors = colorMap[track.color_key] || colorMap.basics;

  const { expandedTrackSlug, toggleTrack } = useLabStore();
  const isExpanded = expandedTrackSlug === track.slug;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <SpotlightCard 
        className={cn(
          "group !p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5 transition-all duration-500 overflow-hidden",
          isExpanded ? "ring-1 ring-indigo-500/30" : ""
        )}
      >
        <div 
          className="p-8 cursor-pointer space-y-6" 
          onClick={() => toggleTrack(track.slug)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className={cn("p-3 rounded-2xl w-fit", colors.bg, colors.text)}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <Badge variant="outline" className={cn("capitalize text-[9px] font-bold tracking-widest", colors.border, colors.text)}>
                  {track.category}
                </Badge>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-white transition-colors">
                  {track.title}
                </h3>
              </div>
            </div>
            
            <CircularProgress percentage={progress} color={colors.ring} />
          </div>

          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
            {track.description}
          </p>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {completedCount}/{track.lessonCount} Modules
              </span>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className="bg-black/20 border-t border-white/5"
            >
              <div className="p-4 space-y-1">
                {track.lessons.map((lesson, sIdx) => {
                  const isCompleted = completedSlugs.has(lesson.slug);
                  return (
                    <Link key={lesson.id} href={`/lab/${lesson.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sIdx * 0.03 }}
                        className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-white/5 transition-all group/item"
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                          isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800/50 text-slate-600"
                        )}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                        </div>
                        <span className={cn(
                          "text-sm font-bold tracking-tight flex-1",
                          isCompleted ? "text-slate-300" : "text-slate-500 group-hover/item:text-slate-300"
                        )}>
                          {lesson.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-indigo-500 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LabPage() {
  const { data: tracks = [], isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["lab-tracks"],
    queryFn: async () => {
      const res = await fetch("/api/lab/tracks");
      if (!res.ok) throw new Error("Failed to fetch tracks");
      return res.json();
    },
  });

  const { data: progress = [] } = useQuery<Progress[]>({
    queryKey: ["lesson-progress"],
    queryFn: async () => {
      const res = await fetch("/api/user/progress");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const completedSlugs = new Set(progress.map((p) => p.lesson_slug));

  const totalLessons = tracks.reduce((sum, t) => sum + t.lessonCount, 0);
  const completedLessons = tracks.reduce(
    (sum, t) => sum + t.lessons.filter((l) => completedSlugs.has(l.slug)).length,
    0
  );
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (tracksLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">Initializing Lab Protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit"
            >
              <GraduationCap className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Knowledge Base</span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
              >
                THE <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">LAB</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
              >
                Step-by-step learning tracks from SQL fundamentals to complex data engineering patterns.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="glass-premium p-6 rounded-[2rem] flex items-center gap-8 min-w-[320px]">
              <div className="relative shrink-0">
                <CircularProgress percentage={overallProgress} color="stroke-blue-500" size={80} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Overall Progress</p>
                </div>
                <p className="text-3xl font-black italic tracking-tighter">{overallProgress}%</p>
                <p className="text-[11px] text-slate-600 font-medium">{completedLessons} of {totalLessons} Lessons</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Hub */}
        <Tabs defaultValue="all" className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <TabsList className="bg-white/5 border border-white/5 p-1.5 rounded-[2rem] h-auto flex flex-wrap gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-[1.5rem] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex items-center gap-3 px-6 py-3 rounded-[2rem] bg-white/5 border border-white/5">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {tracks.length} Learning Vectors Active
              </span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="all" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.map((track, i) => (
                  <TrackCard key={track.slug} track={track} index={i} completedSlugs={completedSlugs} />
                ))}
              </div>
            </TabsContent>

            {categories.slice(1).map((cat) => (
              <TabsContent key={cat.value} value={cat.value} className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tracks
                    .filter((t) => t.category === cat.value)
                    .map((track, i) => (
                      <TrackCard key={track.slug} track={track} index={i} completedSlugs={completedSlugs} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>

      </div>
    </div>
  );
}
