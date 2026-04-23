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
  Link2,
  Calculator,
  Layers,
  BarChart3,
  Sparkles,
  ChevronDown,
  Circle,
  Loader2,
} from "lucide-react";
import { useLabStore } from "@/store/use-lab-store";

// ─── Data ──────────────────────────────────────────────────────────────────

interface Section {
  title: string;
  slug: string;
  status: "completed" | "in_progress" | "not_started";
}

interface Track {
  title: string;
  slug: string;
  description: string;
  category: string;
  sections: Section[];
}

const tracks: Track[] = [
  {
    title: "Introduction to SQL",
    slug: "intro-to-sql",
    description: "SELECT, WHERE, ORDER BY, and LIMIT fundamentals",
    category: "basics",
    sections: [
      { title: "SELECT Basics", slug: "intro-to-sql", status: "completed" },
      { title: "WHERE Filtering", slug: "intro-to-sql", status: "completed" },
      { title: "ORDER BY & LIMIT", slug: "intro-to-sql", status: "completed" },
      { title: "Practice Challenge", slug: "intro-to-sql", status: "completed" },
    ],
  },
  {
    title: "Working with JOINs",
    slug: "working-with-joins",
    description: "INNER, LEFT, RIGHT, FULL joins and self-joins",
    category: "joins",
    sections: [
      { title: "INNER JOIN", slug: "working-with-joins", status: "completed" },
      { title: "LEFT & RIGHT JOIN", slug: "working-with-joins", status: "completed" },
      { title: "FULL OUTER JOIN", slug: "working-with-joins", status: "completed" },
      { title: "Self JOIN", slug: "working-with-joins", status: "in_progress" },
      { title: "Practice Challenge", slug: "working-with-joins", status: "not_started" },
    ],
  },
  {
    title: "Aggregate Functions",
    slug: "aggregate-functions",
    description: "COUNT, SUM, AVG, GROUP BY, and HAVING",
    category: "aggregations",
    sections: [
      { title: "COUNT & SUM", slug: "aggregate-functions", status: "completed" },
      { title: "AVG, MIN, MAX", slug: "aggregate-functions", status: "completed" },
      { title: "GROUP BY", slug: "aggregate-functions", status: "in_progress" },
      { title: "HAVING Clause", slug: "aggregate-functions", status: "not_started" },
    ],
  },
  {
    title: "Subqueries",
    slug: "subqueries",
    description: "Scalar, correlated, EXISTS, and IN subqueries",
    category: "subqueries",
    sections: [
      { title: "Scalar Subqueries", slug: "subqueries", status: "completed" },
      { title: "Correlated Subqueries", slug: "subqueries", status: "in_progress" },
      { title: "EXISTS & IN", slug: "subqueries", status: "not_started" },
      { title: "Practice Challenge", slug: "subqueries", status: "not_started" },
    ],
  },
  {
    title: "Window Functions",
    slug: "window-functions",
    description: "RANK, ROW_NUMBER, LAG, LEAD, and running totals",
    category: "window-functions",
    sections: [
      { title: "ROW_NUMBER & RANK", slug: "window-functions", status: "not_started" },
      { title: "DENSE_RANK vs RANK", slug: "window-functions", status: "not_started" },
      { title: "LAG & LEAD", slug: "window-functions", status: "not_started" },
      { title: "Running Totals", slug: "window-functions", status: "not_started" },
      { title: "Practice Challenge", slug: "window-functions", status: "not_started" },
    ],
  },
];

const categories = [
  { value: "all", label: "All" },
  { value: "basics", label: "Basics" },
  { value: "joins", label: "Joins" },
  { value: "aggregations", label: "Aggregations" },
  { value: "subqueries", label: "Subqueries" },
  { value: "window-functions", label: "Window Functions" },
];

const categoryIcons: Record<string, React.ElementType> = {
  basics: Database,
  joins: Link2,
  aggregations: Calculator,
  subqueries: Layers,
  "window-functions": BarChart3,
};

const categoryColors: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  basics: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "stroke-emerald-500" },
  joins: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", ring: "stroke-blue-500" },
  aggregations: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", ring: "stroke-amber-500" },
  subqueries: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", ring: "stroke-purple-500" },
  "window-functions": { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", ring: "stroke-rose-500" },
};

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

function StatusIcon({ status }: { status: Section["status"] }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (status === "in_progress") return <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />;
  return <Circle className="h-4 w-4 text-slate-700" />;
}

// ─── Track Card ────────────────────────────────────────────────────────────

function TrackCard({ track, index }: { track: Track; index: number }) {
  const completedCount = track.sections.filter((s) => s.status === "completed").length;
  const progress = (completedCount / track.sections.length) * 100;
  const isComplete = completedCount === track.sections.length;
  const Icon = categoryIcons[track.category] || BookOpen;
  const colors = categoryColors[track.category] || categoryColors.basics;

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

        {/* Clickable card header area */}
        <div className="cursor-pointer" onClick={() => toggleTrack(track.slug)}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <Badge variant="outline" className={`capitalize text-[10px] ${colors.border} ${colors.text}`}>
                  {track.category.replace("-", " ")}
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
                  <span className="text-slate-500">{completedCount}/{track.sections.length} sections</span>
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

        {/* Expandable section list */}
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
                  {track.sections.map((section, sIdx) => (
                    <Link key={sIdx} href={`/lab/${section.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sIdx * 0.05 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-all group/item"
                      >
                        <StatusIcon status={section.status} />
                        <span
                          className={`text-sm flex-1 ${
                            section.status === "completed"
                              ? "text-slate-400"
                              : section.status === "in_progress"
                              ? "text-white"
                              : "text-slate-500"
                          } group-hover/item:text-white transition-colors`}
                        >
                          {section.title}
                        </span>
                        {section.status === "in_progress" && (
                          <Badge className="text-[9px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                            In Progress
                          </Badge>
                        )}
                      </motion.div>
                    </Link>
                  ))}
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
  const totalSections = tracks.reduce((sum, t) => sum + t.sections.length, 0);
  const completedSections = tracks.reduce(
    (sum, t) => sum + t.sections.filter((s) => s.status === "completed").length,
    0
  );
  const overallProgress = Math.round((completedSections / totalSections) * 100);

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
            Structured SQL learning tracks from fundamentals to advanced techniques.
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
                    <p className="text-xs text-slate-500">{completedSections} of {totalSections} sections completed</p>
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
                <TrackCard key={track.slug} track={track} index={i} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tracks
                  .filter((t) => t.category === cat.value)
                  .map((track, i) => (
                    <TrackCard key={track.slug} track={track} index={i} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
