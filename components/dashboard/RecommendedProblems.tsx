"use client";

import { motion } from "framer-motion";
import { ChevronRight, Database, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Problem {
  id: number | string;
  title: string;
  slug?: string;
  difficulty: string;
}

export function RecommendedProblems({ problems }: { problems?: Problem[] }) {
  const data = problems || [];

  if (data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Recommended for You
          </h3>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          You've solved everything available! Check back soon.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Recommended for You
        </h3>
        <Link href="/arena" className="text-xs text-blue-500 hover:underline">See All</Link>
      </div>
      <div className="grid gap-3">
        {data.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-blue-500/50 hover:shadow-md"
          >
            <Link href={`/arena/${problem.slug || problem.id}`} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-muted border border-border group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                  <Database className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold group-hover:text-blue-500 transition-colors">{problem.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                      problem.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10",
                      problem.difficulty === "Medium" && "text-amber-500 bg-amber-500/10",
                      problem.difficulty === "Hard" && "text-rose-500 bg-rose-500/10"
                    )}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
