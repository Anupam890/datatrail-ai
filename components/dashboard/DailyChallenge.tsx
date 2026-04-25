"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Timer, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Challenge {
  id: number | string;
  title: string;
  slug?: string;
  difficulty: string;
  description?: string;
}

export function DailyChallenge({ challenge }: { challenge?: Challenge | null }) {
  if (!challenge) {
    return (
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit mb-6">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Daily Objective</span>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No new directives received. Check back at 00:00 UTC.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl group transition-all hover:border-white/10">
      {/* Dynamic Glow */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 blur-[40px] rounded-full" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Daily Objective</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <Timer className="h-3.5 w-3.5" />
            <span>EXPIRES_SOON</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-amber-500 transition-colors duration-500">{challenge.title}</h3>
          {challenge.description && (
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-2">{challenge.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "text-[9px] font-black px-2.5 py-1 rounded-lg border tracking-widest uppercase",
            challenge.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            challenge.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
            challenge.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
          )}>
            {challenge.difficulty}
          </span>
          <div className="h-1 w-1 rounded-full bg-slate-800" />
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">+500 XP</span>
        </div>

        <Link href={`/arena/${challenge.slug || challenge.id}`} className="block pt-2">
          <Button className="w-full group relative overflow-hidden bg-amber-600 hover:bg-amber-500 text-white font-black italic uppercase tracking-wider h-12 rounded-xl shadow-[0_10px_30px_rgba(217,119,6,0.2)] transition-all active:scale-95">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ skewX: -20 }}
            />
            <span className="relative flex items-center justify-center gap-3">
              EXECUTE PROTOCOL <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
    </div>
  );
}
