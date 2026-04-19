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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    solved: true
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
    solved: false
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
    solved: false
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
    solved: true
  }
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
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-6">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
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
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic">THE NEXUS</h1>
            <p className="text-slate-400 max-w-xl text-lg">
              Engage with elite database engineers, share insights, and solve complex SQL challenges together.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-6 rounded-2xl gap-2 shadow-lg shadow-indigo-500/20">
              <Plus className="h-5 w-5" /> Start Discussion
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Threads", value: "12.4k", icon: MessageSquare, color: "text-blue-500" },
            { label: "Daily Queries", value: "842", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Top Contributors", value: "1.2k", icon: Users, color: "text-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black italic tracking-tight">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search discussions, tags, or users..." 
              className="bg-slate-900/50 border-slate-800 h-12 pl-12 rounded-2xl focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 h-12 px-6 rounded-2xl gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Discussion List */}
          <div className="lg:col-span-8 space-y-4">
            {discussions.map((discussion, i) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-900/30 border-slate-800/50 hover:bg-slate-900/50 transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="hidden sm:flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center font-bold text-lg">
                          {discussion.avatar}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          <ThumbsUp className="h-3 w-3" /> {discussion.likes}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors leading-tight">
                              {discussion.title}
                            </h3>
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
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {discussion.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-slate-800/50 text-slate-400 hover:text-white transition-colors border-none text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                          <div className="ml-auto flex items-center gap-4 text-slate-500">
                            <div className="flex items-center gap-1.5 text-xs">
                              <MessageCircle className="h-4 w-4" /> {discussion.replies}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <Share2 className="h-4 w-4" />
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
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-indigo-600/5 border-indigo-500/10 p-6 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500 blur-[80px] opacity-20" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4">Trending Topics</h4>
              <div className="space-y-4">
                {categories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                    <Badge variant="outline" className="border-slate-800 text-[10px] text-slate-500">
                      {cat.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Nexus Guidelines</h4>
              <ul className="space-y-4 text-xs text-slate-400">
                <li className="flex gap-3 italic">
                  <span className="text-indigo-500">01</span>
                  Always include the SQL dialect (Postgres, MySQL, etc.) in your posts.
                </li>
                <li className="flex gap-3 italic">
                  <span className="text-indigo-500">02</span>
                  Sanitize sensitive data before sharing queries.
                </li>
                <li className="flex gap-3 italic">
                  <span className="text-indigo-500">03</span>
                  Mark solutions to help others find answers faster.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
