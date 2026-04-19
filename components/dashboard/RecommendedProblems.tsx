"use client";

import { motion } from "framer-motion";
import { ChevronRight, Database, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  solvedCount: string;
  acceptance: string;
}

const problems: Problem[] = [
  { id: "1", title: "Monthly Active Users", difficulty: "Medium", category: "Social", solvedCount: "12.4k", acceptance: "42%" },
  { id: "2", title: "Rolling 7-Day Revenue", difficulty: "Hard", category: "Finance", solvedCount: "8.2k", acceptance: "28%" },
  { id: "3", title: "Find New Customers", difficulty: "Easy", category: "Retail", solvedCount: "25.1k", acceptance: "65%" },
];

export function RecommendedProblems() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Recommended for You
        </h3>
        <button className="text-xs text-blue-500 hover:underline">See Path</button>
      </div>
      <div className="grid gap-3">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-blue-500/50 hover:shadow-md"
          >
            <Link href={`/arena/${problem.id}`} className="flex items-center justify-between">
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
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      <Users className="h-3 w-3" />
                      {problem.solvedCount}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      {problem.acceptance} Accept
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
