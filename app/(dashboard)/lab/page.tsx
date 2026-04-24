"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { useLabStore } from "@/store/use-lab-store";
import { useQuery } from "@tanstack/react-query";

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

const colorMap: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  basics: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "stroke-emerald-500" },
  modify: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", ring: "stroke-cyan-500" },
  filter: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", ring: "stroke-orange-500" },
  aggregate: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", ring: "stroke-amber-500" },
  joins: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", ring: "stroke-blue-500" },
  subqueries: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", ring: "stroke-purple-500" },
  window: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", ring: "stroke-rose-500" },
  design: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", ring: "stroke-teal-500" },
  functions: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", ring: "stroke-pink-500" },
  advanced: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", ring: "stroke-indigo-500" },
};

const categories = [
  { value: "all", label: "All" },
  { value: "basics", label: "Basics" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

// ─── Circular Progress ─────────────────────────────────────────────────────

function CircularProgress({ percentage, color, size = 48 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-slate-800" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={`fill-none ${color}`}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        strokeDasharray={circumference}
      />
    </svg>
  );
}

// ─── Section status icon ───────────────────────────────────────────────────

function StatusIcon({ completed }: { completed: boolean }) {
  if (completed) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  return <Circle className="h-4 w-4 text-slate-700" />;
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
      transition={{ delay: index * 0.08 }}
    >
      <Card className="bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
        {isComplete && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300" />
        )}

        <div className="cursor-pointer" onClick={() => toggleTrack(track.slug)}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <Badge variant="outline" className={`capitalize text-[10px] ${colors.border} ${colors.text}`}>
                  {track.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {isComplete && (
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                )}
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </motion.div>
              </div>
            </div>
            <CardTitle className="text-lg mt-3 group-hover:text-white transition-colors">{track.title}</CardTitle>
            <CardDescription className="text-slate-500">{track.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <CircularProgress percentage={progress} color={colors.ring} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{completedCount}/{track.lessonCount} lessons</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : "bg-indigo-500"}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Expandable lesson list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pt-2 border-t border-slate-800/50">
                <div className="space-y-1">
                  {track.lessons.map((lesson, sIdx) => {
                    const isCompleted = completedSlugs.has(lesson.slug);
                    return (
                      <Link key={lesson.id} href={`/lab/${lesson.slug}`}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: sIdx * 0.05 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-all group/item"
                        >
                          <StatusIcon completed={isCompleted} />
                          <span
                            className={`text-sm flex-1 ${
                              isCompleted ? "text-slate-400" : "text-slate-500"
                            } group-hover/item:text-white transition-colors`}
                          >
                            {lesson.title}
                          </span>
                          {isCompleted && (
                            <Badge className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              Done
                            </Badge>
                          )}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
          <p className="text-slate-400">Loading learning tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-8 md:py-12 px-4 md:px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] -right-[10%] w-[25%] h-[25%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit"
          >
            <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Learning Tracks</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic"
          >
            THE LAB
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-xl text-lg"
          >
            Structured SQL learning — {tracks.length} tracks, {totalLessons} lessons from basics to advanced.
          </motion.p>
        </div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Overall Progress</p>
                    <p className="text-xs text-slate-500">{completedLessons} of {totalLessons} lessons completed</p>
                  </div>
                </div>
                <span className="text-2xl font-black italic text-indigo-400">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs + Cards */}
        <Tabs defaultValue="all">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="bg-slate-900/50 border border-slate-800 p-1 rounded-2xl">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-slate-800 data-[state=active]:text-white"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track, i) => (
                <TrackCard key={track.slug} track={track} index={i} completedSlugs={completedSlugs} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tracks
                  .filter((t) => t.category === cat.value)
                  .map((track, i) => (
                    <TrackCard key={track.slug} track={track} index={i} completedSlugs={completedSlugs} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
