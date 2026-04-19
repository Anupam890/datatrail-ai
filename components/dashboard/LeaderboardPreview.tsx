"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const topUsers = [
  { rank: 1, name: "saurav_v", solved: 482, score: 12450 },
  { rank: 2, name: "db_master", solved: 456, score: 11820 },
  { rank: 3, name: "sql_queen", solved: 412, score: 10900 },
  { rank: 4, name: "anupam_890", solved: 389, score: 9800, isCurrent: true },
  { rank: 5, name: "query_king", solved: 367, score: 9200 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-4 w-4 text-amber-500" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
  return <span className="text-xs font-bold text-muted-foreground">{rank}</span>;
};

export function LeaderboardPreview() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium">Global Leaderboard</h3>
        </div>
        <Link href="/ranks" className="text-xs text-blue-500 hover:underline">Full Standings</Link>
      </div>
      <div className="p-2 space-y-1">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-colors",
              user.isCurrent ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  user.isCurrent ? "text-blue-500" : "text-foreground"
                )}>
                  {user.name} {user.isCurrent && "(You)"}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {user.solved} Solved
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono tracking-tight">{user.score}</span>
              <p className="text-[9px] text-muted-foreground uppercase">Points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
