"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Search, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";

const discussions = [
  {
    id: 1,
    title: "Optimizing Recursive CTEs for Large Hierarchies",
    author: "sql_ninja",
    avatar: "S",
    tags: ["Optimization", "PostgreSQL"],
    replies: 24,
    likes: 56,
    time: "2h ago",
    solved: true,
    hot: true,
  },
  {
    id: 2,
    title: "How to handle NULLs in complex aggregations?",
    author: "query_newbie",
    avatar: "Q",
    tags: ["Basics", "Aggregations"],
    replies: 12,
    likes: 8,
    time: "4h ago",
    solved: false,
    hot: false,
  },
  {
    id: 3,
    title: "SQL vs NoSQL: When to choose which for analytics?",
    author: "db_architect",
    avatar: "D",
    tags: ["Architecture", "Discussion"],
    replies: 89,
    likes: 142,
    time: "1d ago",
    solved: false,
    hot: true,
  },
  {
    id: 4,
    title: "Window Functions: RANK() vs DENSE_RANK()",
    author: "master_coder",
    avatar: "M",
    tags: ["Window Functions", "Tutorial"],
    replies: 45,
    likes: 92,
    time: "2d ago",
    solved: true,
    hot: false,
  },
];

const categories = [
  { name: "General", count: 1240 },
  { name: "SQL Help", count: 850 },
  { name: "Optimization", count: 420 },
  { name: "Architecture", count: 180 },
  { name: "Career", count: 310 },
];

export default function NexusPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-8 md:py-12 px-4 md:px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] -right-[15%] w-[25%] h-[25%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Community Nexus</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic"
            >
              THE NEXUS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-xl text-lg"
            >
              Engage with elite database engineers, share insights, and solve complex SQL challenges together.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 h-12 rounded-2xl gap-2 shadow-lg shadow-indigo-500/20">
              <Plus className="h-5 w-5" /> Start Discussion
            </Button>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: "Active Threads", value: 12400, suffix: "", icon: MessageSquare, color: "text-blue-500" },
            { label: "Daily Queries", value: 842, suffix: "", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Contributors", value: 1200, suffix: "+", icon: Users, color: "text-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black italic tracking-tight">
                    <CountUp to={stat.value} duration={1.5} />{stat.suffix}
                  </p>
                </div>
                <stat.icon className={`h-7 w-7 ${stat.color} opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search discussions, tags, or users..." 
              className="bg-slate-900/50 border-slate-800 h-12 pl-12 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 h-12 px-6 rounded-2xl gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Discussion List */}
          <div className="lg:col-span-8 space-y-3">
            {discussions.map((discussion, i) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <Card className="bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex gap-5">
                      <div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center font-bold text-base group-hover:border-indigo-500/30 transition-colors">
                          {discussion.avatar}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          <ThumbsUp className="h-3 w-3" /> {discussion.likes}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base md:text-lg font-bold group-hover:text-indigo-400 transition-colors leading-tight">
                              {discussion.title}
                            </h3>
                            {discussion.hot && (
                              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px] gap-1 shrink-0">
                                <Flame className="h-2.5 w-2.5" /> Hot
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="font-bold text-slate-400">@{discussion.author}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {discussion.time}</span>
                            {discussion.solved && (
                              <span className="flex items-center gap-1 text-emerald-500 font-bold uppercase tracking-widest text-[9px]">
                                <CheckCircle2 className="h-3 w-3" /> Solved
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {discussion.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-slate-800/50 text-slate-400 hover:text-white transition-colors border-none text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                          <div className="ml-auto flex items-center gap-4 text-slate-500 shrink-0">
                            <div className="flex items-center gap-1.5 text-xs">
                              <MessageCircle className="h-3.5 w-3.5" /> {discussion.replies}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs hover:text-slate-300 transition-colors">
                              <Share2 className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-indigo-600/5 border-indigo-500/10 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500 blur-[80px] opacity-20" />
                <CardContent className="p-5 relative">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">Trending Topics</h4>
                  <div className="space-y-3">
                    {categories.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer py-1">
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                        <Badge variant="outline" className="border-slate-800 text-[10px] text-slate-500 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                          {cat.count.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Nexus Guidelines</h4>
                  <ul className="space-y-4 text-xs text-slate-400">
                    <li className="flex gap-3 italic">
                      <span className="text-indigo-500 font-bold">01</span>
                      Always include the SQL dialect (Postgres, MySQL, etc.) in your posts.
                    </li>
                    <li className="flex gap-3 italic">
                      <span className="text-indigo-500 font-bold">02</span>
                      Sanitize sensitive data before sharing queries.
                    </li>
                    <li className="flex gap-3 italic">
                      <span className="text-indigo-500 font-bold">03</span>
                      Mark solutions to help others find answers faster.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
