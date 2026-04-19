"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function RanksPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Global Ranks</h1>
          <p className="text-muted-foreground text-lg">The world's best SQL developers, ranked by performance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-4 py-2 rounded-full border border-border">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Updated every 15 minutes
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 md:order-1"
        >
          <Card className="bg-[#111827]/50 border-slate-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-400" />
            <CardContent className="pt-12 pb-8">
              <div className="h-16 w-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center relative">
                <span className="text-2xl font-bold">D</span>
                <div className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 rounded-full h-8 w-8 flex items-center justify-center font-bold border-4 border-[#111827]">2</div>
              </div>
              <h3 className="text-xl font-bold mb-1">DataQueen</h3>
              <p className="text-slate-400 text-sm mb-4">14,850 pts</p>
              <Badge variant="outline" className="bg-slate-400/10 text-slate-400 border-slate-400/20">Silver Tier</Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 md:order-2"
        >
          <Card className="bg-[#111827] border-amber-500/30 text-center relative overflow-hidden shadow-2xl shadow-amber-500/5">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-yellow-300" />
            <CardContent className="pt-16 pb-12">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 mx-auto mb-6 flex items-center justify-center relative p-1">
                <div className="h-full w-full rounded-full bg-[#111827] flex items-center justify-center text-3xl font-bold">W</div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 rounded-full h-10 w-10 flex items-center justify-center font-bold border-4 border-[#111827]">1</div>
                <Trophy className="absolute -top-10 left-1/2 -translate-x-1/2 h-8 w-8 text-amber-400 drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-black mb-1">SQL_Wizard</h3>
              <p className="text-amber-500 font-bold mb-4">15,420 pts</p>
              <Badge className="bg-amber-400 text-amber-950 font-bold px-4 py-1">Grandmaster</Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3"
        >
          <Card className="bg-[#111827]/50 border-amber-900/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-700" />
            <CardContent className="pt-12 pb-8">
              <div className="h-16 w-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center relative">
                <span className="text-2xl font-bold">Q</span>
                <div className="absolute -top-2 -right-2 bg-amber-700 text-amber-50 rounded-full h-8 w-8 flex items-center justify-center font-bold border-4 border-[#111827]">3</div>
              </div>
              <h3 className="text-xl font-bold mb-1">QueryMaster</h3>
              <p className="text-slate-400 text-sm mb-4">14,200 pts</p>
              <Badge variant="outline" className="bg-amber-700/10 text-amber-700 border-amber-700/20">Bronze Tier</Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Table */}
      <Card className="border-slate-800 bg-[#111827]/30 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Rank</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">User</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Points</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Solved</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-xs">Accuracy</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user, i) => (
                  <tr key={user.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400">#{user.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-400">{user.points.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400">{user.solved}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${user.accuracy}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{user.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4 text-slate-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
