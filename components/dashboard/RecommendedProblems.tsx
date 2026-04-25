"use client";

import { motion } from "framer-motion";
import { ChevronRight, Database, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
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
      <div className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
          Everything up to date. No new recommendations available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {data.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="group relative"
          >
            <Link href={`/arena/${problem.slug || problem.id}`} className="block">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/5 bg-slate-900/40 p-5 transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-all duration-500">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-black italic tracking-tighter uppercase group-hover:text-white transition-colors">
                        {problem.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded-lg border tracking-[0.15em] uppercase leading-none",
                          problem.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                          problem.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
                          problem.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
                        )}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all text-indigo-400">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <Link href="/arena" className="flex items-center justify-center gap-2 group p-4 rounded-2xl border border-dashed border-white/5 text-slate-600 hover:text-indigo-400 hover:border-indigo-500/20 transition-all">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">View All Problems</span>
        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
