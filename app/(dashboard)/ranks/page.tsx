"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowUpRight, TrendingUp, Crown, Medal, Target, Flame } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";

const topUsers = [
  { rank: 1, name: "SQL_Wizard", points: 15420, solved: 1240, accuracy: 98.2, trend: "up" },
  { rank: 2, name: "DataQueen", points: 14850, solved: 1190, accuracy: 97.5, trend: "stable" },
  { rank: 3, name: "QueryMaster", points: 14200, solved: 1150, accuracy: 96.8, trend: "down" },
];

const users = [
  { rank: 4, name: "SchemaArchitect", points: 13900, solved: 1100, accuracy: 95.4 },
  { rank: 5, name: "JoinNinja", points: 13500, solved: 1080, accuracy: 94.2 },
  { rank: 6, name: "OptimizingDev", points: 13100, solved: 1050, accuracy: 93.8 },
  { rank: 7, name: "SQL_Pro", points: 12800, solved: 1020, accuracy: 92.5 },
  { rank: 8, name: "DatabaseDynamo", points: 12500, solved: 1000, accuracy: 91.8 },
  { rank: 9, name: "RelationalRacer", points: 12200, solved: 980, accuracy: 90.5 },
  { rank: 10, name: "IndexExpert", points: 11900, solved: 950, accuracy: 89.8 },
];

const tierBadges: Record<string, { label: string; className: string }> = {
  grandmaster: { label: "Grandmaster", className: "bg-amber-400 text-amber-950 font-bold" },
  master: { label: "Master", className: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  diamond: { label: "Diamond", className: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  platinum: { label: "Platinum", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

function getTier(points: number) {
  if (points >= 15000) return tierBadges.grandmaster;
  if (points >= 13000) return tierBadges.master;
  if (points >= 12000) return tierBadges.diamond;
  return tierBadges.platinum;
}

export default function RanksPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-8 md:py-12 px-4 md:px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[15%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] w-[20%] h-[20%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit"
            >
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Leaderboard</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic"
            >
              GLOBAL RANKS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-xl text-lg"
            >
              The world&apos;s best SQL developers, ranked by performance.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-4 py-2.5 rounded-full border border-slate-800"
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            Updated every 15 minutes
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Players", value: 8420, icon: Target, color: "text-indigo-500" },
            { label: "Avg Accuracy", value: 94, suffix: "%", icon: Flame, color: "text-amber-500" },
            { label: "Problems Solved", value: 52800, icon: Trophy, color: "text-emerald-500" },
            { label: "This Season", value: 3, suffix: "", prefix: "S", icon: Medal, color: "text-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-black italic tracking-tight">
                      {stat.prefix || ""}<CountUp to={stat.value} duration={1.5} />{stat.suffix || ""}
                    </p>
                  </div>
                  <stat.icon className={`h-5 w-5 ${stat.color} opacity-30`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <Card className="bg-slate-900/50 border-slate-800 text-center relative overflow-hidden group hover:border-slate-600 transition-colors">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-slate-500 to-slate-300" />
              <CardContent className="pt-10 pb-8">
                <div className="h-16 w-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center relative group-hover:ring-2 group-hover:ring-slate-500/30 transition-all">
                  <span className="text-2xl font-bold">D</span>
                  <div className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold border-4 border-[#0B0F19]">2</div>
                </div>
                <h3 className="text-lg font-bold mb-0.5">DataQueen</h3>
                <p className="text-slate-400 text-sm mb-3 font-mono">
                  <CountUp to={14850} duration={1.5} /> pts
                </p>
                <Badge variant="outline" className="bg-slate-400/10 text-slate-400 border-slate-400/20 text-[10px]">Silver Tier</Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="order-1 md:order-2"
          >
            <Card className="bg-slate-900/50 border-amber-500/30 text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 group hover:shadow-amber-500/15 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-300" />
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-amber-500/5 blur-[60px] pointer-events-none" />
              <CardContent className="pt-14 pb-10 relative">
                <Trophy className="mx-auto h-7 w-7 text-amber-400 mb-4 drop-shadow-lg" />
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 mx-auto mb-5 flex items-center justify-center relative p-0.5 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
                  <div className="h-full w-full rounded-full bg-[#0B0F19] flex items-center justify-center text-2xl font-bold">W</div>
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold border-4 border-[#0B0F19]">1</div>
                </div>
                <h3 className="text-xl font-black mb-0.5">SQL_Wizard</h3>
                <p className="text-amber-500 font-bold mb-4 font-mono">
                  <CountUp to={15420} duration={1.5} /> pts
                </p>
                <Badge className="bg-amber-400 text-amber-950 font-bold px-4 py-1">Grandmaster</Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="order-3"
          >
            <Card className="bg-slate-900/50 border-amber-900/20 text-center relative overflow-hidden group hover:border-amber-800/30 transition-colors">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-800 to-amber-600" />
              <CardContent className="pt-10 pb-8">
                <div className="h-16 w-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center relative group-hover:ring-2 group-hover:ring-amber-800/30 transition-all">
                  <span className="text-2xl font-bold">Q</span>
                  <div className="absolute -top-2 -right-2 bg-amber-700 text-amber-50 rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold border-4 border-[#0B0F19]">3</div>
                </div>
                <h3 className="text-lg font-bold mb-0.5">QueryMaster</h3>
                <p className="text-slate-400 text-sm mb-3 font-mono">
                  <CountUp to={14200} duration={1.5} /> pts
                </p>
                <Badge variant="outline" className="bg-amber-700/10 text-amber-700 border-amber-700/20 text-[10px]">Bronze Tier</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 bg-slate-900/50">
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Rank</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">User</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Points</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Solved</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Accuracy</th>
                      <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Tier</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {users.map((user, i) => {
                      const tier = getTier(user.points);
                      return (
                        <motion.tr
                          key={user.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.04 }}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4 font-mono font-bold text-slate-500">#{user.rank}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-semibold group-hover:text-white transition-colors">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-indigo-400">{user.points.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono">{user.solved.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-emerald-500 rounded-full"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${user.accuracy}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: 0.3 }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 font-mono">{user.accuracy}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`text-[9px] ${tier.className}`}>{tier.label}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowUpRight className="h-4 w-4 text-slate-500" />
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
