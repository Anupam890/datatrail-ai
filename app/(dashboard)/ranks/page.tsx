"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import Link from "next/link";
import { 
  Trophy, 
  TrendingUp, 
  Crown, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  points: number;
  solved: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
}

interface LeaderboardResponse {
  users: LeaderboardUser[];
  total: number;
  limit: number;
  offset: number;
}

const tierBadges: Record<string, { label: string; className: string; icon: any }> = {
  grandmaster: { label: "GRANDMASTER", className: "bg-amber-400 text-amber-950", icon: Crown },
  master: { label: "MASTER", className: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", icon: ShieldCheck },
  diamond: { label: "DIAMOND", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: Zap },
  platinum: { label: "PLATINUM", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: Star },
};

function getTier(points: number) {
  if (points >= 15000) return tierBadges.grandmaster;
  if (points >= 5000) return tierBadges.master;
  if (points >= 1000) return tierBadges.diamond;
  return tierBadges.platinum;
}

export default function RanksPage() {
  const { data, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?limit=50");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
  });

  const allUsers = data?.users || [];
  const topUsers = allUsers.slice(0, 3);
  const restUsers = allUsers.slice(3);

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-amber-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Competitive Sector</span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
              >
                THE <span className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">LEADERBOARD</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
              >
                Top performing data engineers across the global neural network. Rank is updated in real-time.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-[2rem] backdrop-blur-md"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Players</p>
              <p className="text-sm font-black italic tracking-wider uppercase">{data?.total || 0} Registered</p>
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center gap-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 bg-amber-500/20 blur-xl" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">Loading Rankings...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allUsers.length === 0 && (
          <div className="py-24 text-center space-y-6">
            <Trophy className="h-16 w-16 text-slate-700 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">No rankings yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Be the first to solve problems and claim the top spot!</p>
            </div>
            <Link href="/arena">
              <Button className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Go to Arena
              </Button>
            </Link>
          </div>
        )}

        {/* Podium Layout */}
        {topUsers.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
            
            {/* 2nd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <Link href={`/u/${topUsers[1].username}`}>
                <SpotlightCard className="!p-0 rounded-[3rem] bg-slate-900/40 border-white/5 group hover:border-slate-500/30 transition-all duration-500">
                  <div className="p-8 text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 to-slate-600" />
                    <div className="relative mx-auto h-24 w-24 rounded-[2rem] bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {topUsers[1].avatarUrl ? (
                        <img src={topUsers[1].avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black italic">{(topUsers[1].displayName || topUsers[1].username).slice(0, 2).toUpperCase()}</span>
                      )}
                      <div className="absolute -top-3 -right-3 h-10 w-10 rounded-2xl bg-slate-400 text-slate-950 flex items-center justify-center font-black border-4 border-[#0B0F19]">2</div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase">{topUsers[1].displayName || topUsers[1].username}</h3>
                      <p className="text-slate-400 font-mono text-sm tracking-widest">{topUsers[1].points.toLocaleString()} XP</p>
                    </div>
                    <Badge variant="outline" className="rounded-xl px-4 py-1.5 border-slate-500/30 text-slate-400 text-[10px] font-black tracking-widest">
                      {topUsers[1].solved} SOLVED
                    </Badge>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>

            {/* 1st Place */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <Link href={`/u/${topUsers[0].username}`}>
                <SpotlightCard className="!p-0 rounded-[3.5rem] bg-slate-900/40 border-amber-500/30 group hover:border-amber-500/50 transition-all duration-500 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
                  <div className="p-10 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-yellow-600" />
                    <div className="space-y-6">
                      <div className="relative mx-auto h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-500">
                        <div className="h-full w-full rounded-[2.2rem] bg-[#0B0F19] flex items-center justify-center overflow-hidden">
                          {topUsers[0].avatarUrl ? (
                            <img src={topUsers[0].avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-600">
                              {(topUsers[0].displayName || topUsers[0].username).slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black border-4 border-[#0B0F19]">1</div>
                        <Crown className="absolute -top-12 left-1/2 -translate-x-1/2 h-8 w-8 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{topUsers[0].displayName || topUsers[0].username}</h3>
                        <p className="text-amber-500 font-black font-mono text-lg tracking-widest">{topUsers[0].points.toLocaleString()} XP</p>
                      </div>
                    </div>
                    <Badge className="rounded-2xl px-6 py-2 bg-amber-400 text-amber-950 text-xs font-black tracking-[0.2em]">
                      {getTier(topUsers[0].points).label}
                    </Badge>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="order-3"
            >
              <Link href={`/u/${topUsers[2].username}`}>
                <SpotlightCard className="!p-0 rounded-[3rem] bg-slate-900/40 border-white/5 group hover:border-orange-800/30 transition-all duration-500">
                  <div className="p-8 text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-800" />
                    <div className="relative mx-auto h-24 w-24 rounded-[2rem] bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      {topUsers[2].avatarUrl ? (
                        <img src={topUsers[2].avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black italic">{(topUsers[2].displayName || topUsers[2].username).slice(0, 2).toUpperCase()}</span>
                      )}
                      <div className="absolute -top-3 -right-3 h-10 w-10 rounded-2xl bg-amber-700 text-amber-50 flex items-center justify-center font-black border-4 border-[#0B0F19]">3</div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase">{topUsers[2].displayName || topUsers[2].username}</h3>
                      <p className="text-slate-400 font-mono text-sm tracking-widest">{topUsers[2].points.toLocaleString()} XP</p>
                    </div>
                    <Badge variant="outline" className="rounded-xl px-4 py-1.5 border-amber-800/30 text-amber-700 text-[10px] font-black tracking-widest">
                      {topUsers[2].solved} SOLVED
                    </Badge>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Full Rankings Table */}
        {restUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <SpotlightCard className="!p-0 rounded-[3rem] bg-slate-900/40 border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500">
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Rank</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Player</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">XP</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Solved</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Accuracy</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]">Tier</th>
                      <th className="px-8 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {restUsers.map((user, i) => {
                      const tier = getTier(user.points);
                      const TierIcon = tier.icon;
                      return (
                        <motion.tr
                          key={user.userId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-8 py-6">
                            <span className="font-mono font-black italic text-slate-600 text-lg group-hover:text-amber-500 transition-colors">
                              #{user.rank.toString().padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <Link href={`/u/${user.username}`} className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-black italic text-xs border border-white/5 group-hover:border-amber-500/30 transition-all overflow-hidden">
                                {user.avatarUrl ? (
                                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  (user.displayName || user.username).charAt(0).toUpperCase()
                                )}
                              </div>
                              <span className="font-black italic tracking-tight uppercase group-hover:text-white transition-colors">
                                {user.displayName || user.username}
                              </span>
                            </Link>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-mono font-black italic tracking-widest text-indigo-400">
                              {user.points.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-mono font-bold text-slate-500">
                              {user.solved.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald-500 rounded-full"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${user.accuracy}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-[10px] font-black font-mono text-slate-600">{user.accuracy}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit", tier.className)}>
                              <TierIcon className="h-3 w-3" />
                              <span className="text-[9px] font-black tracking-widest">{tier.label}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <Link href={`/u/${user.username}`}>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/5">
                                <ArrowRight className="h-4 w-4 text-slate-500" />
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SpotlightCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
