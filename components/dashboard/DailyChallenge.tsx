"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Timer } from "lucide-react";
import Link from "next/link";

export function DailyChallenge() {
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
            <span>14h 22m left</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Advanced Revenue Window Functions</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            Calculate the month-over-month growth rate for a specific department using LEAD/LAG.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">Hard</span>
          <span className="text-xs text-muted-foreground">SQL • Windows</span>
        </div>

        <Link href="/arena/daily" className="block">
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
