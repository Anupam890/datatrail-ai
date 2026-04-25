"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Globe,
  ArrowRight,
  Database,
  Hash,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

const discussions = [
  {
    id: 1,
    title: "OPTIMIZING RECURSIVE CTES FOR LARGE HIERARCHIES",
    author: "sql_ninja",
    avatar: "S",
    tags: ["Optimization", "PostgreSQL"],
    replies: 24,
    likes: 56,
    time: "2h ago",
    solved: true,
    preview: "When dealing with adjacency lists of over 1M records, the default recursive strategy fails..."
  },
  {
    id: 2,
    title: "HOW TO HANDLE NULLS IN COMPLEX AGGREGATIONS?",
    author: "query_newbie",
    avatar: "Q",
    tags: ["Basics", "Aggregations"],
    replies: 12,
    likes: 8,
    time: "4h ago",
    solved: false,
    preview: "I'm seeing inconsistent results when using COALESCE inside a SUM() partitioned by date..."
  },
  {
    id: 3,
    title: "SQL VS NOSQL: WHEN TO CHOOSE WHICH FOR ANALYTICS?",
    author: "db_architect",
    avatar: "D",
    tags: ["Architecture", "Discussion"],
    replies: 89,
    likes: 142,
    time: "1d ago",
    solved: false,
    preview: "Looking at the trade-offs between Snowflake's columnar storage and MongoDB's document model..."
  },
  {
    id: 4,
    title: "WINDOW FUNCTIONS: RANK() VS DENSE_RANK()",
    author: "master_coder",
    avatar: "M",
    tags: ["Window Functions", "Tutorial"],
    replies: 45,
    likes: 92,
    time: "2d ago",
    solved: true,
    preview: "A deep dive into how ties are handled across different SQL implementations and why it matters..."
  }
];

const categories = [
  { name: "PRODUCTION_SUPPORT", count: 1240, icon: ShieldCheckIcon },
  { name: "QUERY_OPTIMIZATION", count: 850, icon: Zap },
  { name: "SCHEMA_DESIGN", count: 420, icon: Database },
  { name: "ANALYTICS_PATTERNS", count: 180, icon: TrendingUp },
  { name: "CAREER_PATHS", count: 310, icon: Globe },
];

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function NexusPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Collaborative Network</span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
              >
                THE <span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">NEXUS</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
              >
                Peer-to-peer discussions for complex database engineering and architectural problem solving.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black italic tracking-wider px-8 h-14 rounded-2xl gap-3 shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5" />
              New Post
            </Button>
          </motion.div>
        </div>

        {/* Search Hub */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 p-2 glass-premium rounded-[2.5rem]"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search discussions by title, tags, or user..."
              className="bg-transparent border-none h-16 pl-16 pr-6 text-base font-medium focus:ring-0 placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 font-bold text-[10px] uppercase tracking-widest gap-2">
              <Filter className="h-4 w-4" /> REFILTER
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Globe className="h-3 w-3" /> Active Discussions
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                <span>NEWEST</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-700">TRENDING</span>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {discussions.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <SpotlightCard className="group !p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                      <div className="p-8 space-y-6">
                        <div className="flex items-start gap-6">
                          <div className="hidden sm:flex flex-col items-center gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black italic text-xl group-hover:scale-110 transition-transform duration-500">
                              {post.avatar}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <ThumbsUp className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                              <span className="text-[10px] font-black text-slate-500">{post.likes}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-indigo-400 transition-colors leading-[1.1]">
                                  {post.title}
                                </h3>
                                {post.solved && (
                                  <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                  </div>
                                )}
                              </div>
                              <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                                {post.preview}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="rounded-lg bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{post.replies} Replies</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                  <Clock className="h-3.5 w-3.5" /> {post.time}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-indigo-400">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Components */}
          <div className="lg:col-span-4 space-y-10">
            
            <div className="space-y-4">
              <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Hash className="h-3 w-3" /> SECTOR_TAGS
              </h2>
              <div className="glass-premium p-4 rounded-[2.5rem] space-y-2">
                {categories.map((cat, i) => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-white/5 bg-white/5 text-[9px] font-black text-slate-500">
                        {cat.count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <SpotlightCard className="!p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20 space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-black italic tracking-tighter uppercase">Guidelines</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Maintain neural clarity by following sector standards.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "ALWAYS SPECIFY SQL_DIALECT",
                  "SANITIZE SENSITIVE_STRINGS",
                  "MARK_SOLVED FOR NETWORK_INDEXING"
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <ChevronRight className="h-3 w-3 text-indigo-500" />
                    {rule}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full rounded-xl border-indigo-500/30 text-indigo-400 font-black italic uppercase tracking-wider text-[10px] h-12">
                View Guidelines
              </Button>
            </SpotlightCard>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">TOP_CONTRIBUTORS</h4>
                <Users className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-xl ring-4 ring-[#0B0F19] bg-slate-800 border border-white/10 flex items-center justify-center font-black text-[10px]">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-xl ring-4 ring-[#0B0F19] bg-indigo-600 font-black text-[10px]">
                  +8
                </div>
              </div>
              <p className="text-[10px] text-slate-600 font-bold italic">
                842 new users joined the community this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
