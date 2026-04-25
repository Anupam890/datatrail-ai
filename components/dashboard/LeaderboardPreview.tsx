"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Trophy, Medal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  rank: number;
  name: string;
  solved: number;
  score: number;
  isCurrent?: boolean;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-4 w-4 text-amber-500" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
  return <span className="text-[10px] font-black text-slate-600">{rank}</span>;
};

export function LeaderboardPreview({ users }: { users?: LeaderboardUser[] }) {
  const topUsers = users && users.length > 0 ? users : [];

  if (topUsers.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
          No ranking data synchronized.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="p-3 space-y-1.5">
        {topUsers.slice(0, 5).map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center justify-between p-4 rounded-[1.5rem] transition-all group",
              user.isCurrent 
                ? "bg-indigo-600/10 border border-indigo-500/20" 
                : "hover:bg-white/5 border border-transparent"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-6 group-hover:scale-110 transition-transform">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-xs font-black italic uppercase tracking-tighter",
                  user.isCurrent ? "text-indigo-400" : "text-white"
                )}>
                  {user.name} {user.isCurrent && "(OPERATOR)"}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5">
                  {user.solved} NODES_SOLVED
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black font-mono tracking-tight group-hover:text-indigo-400 transition-colors">{user.score.toLocaleString()}</span>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-none">XP</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link 
        href="/ranks" 
        className="flex items-center justify-center gap-2 p-5 bg-white/5 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
      >
        ACCESS GLOBAL_STANDINGS
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
