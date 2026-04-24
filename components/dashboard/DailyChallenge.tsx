"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Timer } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Daily Challenge</span>
        </div>
        <p className="text-sm text-muted-foreground mt-4">No challenge available today. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm group">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Daily Challenge</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" />
            <span>Resets daily</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">{challenge.title}</h3>
          {challenge.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded border",
            challenge.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            challenge.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
            challenge.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
          )}>
            {challenge.difficulty}
          </span>
        </div>

        <Link href={`/arena/${challenge.slug || challenge.id}`} className="block">
          <Button className="w-full group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">
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
            <span className="relative flex items-center gap-2">
              Solve Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
      </div>

      {/* Decorative Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-emerald-500 blur-3xl"
      />
    </div>
  );
}
