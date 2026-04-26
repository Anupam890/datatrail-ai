"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MessageSquare,
  TrendingUp,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Database,
  Hash,
  X,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { toast } from "sonner";

const CATEGORIES = [
  { name: "all", label: "ALL_TOPICS", icon: Globe },
  { name: "query-help", label: "QUERY_HELP", icon: Zap },
  { name: "optimization", label: "OPTIMIZATION", icon: TrendingUp },
  { name: "schema-design", label: "SCHEMA_DESIGN", icon: Database },
  { name: "discussion", label: "GENERAL_DISCUSSION", icon: MessageSquare },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_solved: boolean;
  likes_count: number;
  replies_count: number;
  created_at: string;
  author: { id: string; name: string; image: string | null } | null;
}

export default function NexusPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "trending">("newest");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("discussion");
  const [newTags, setNewTags] = useState("");

  const { data: discussions = [], isLoading } = useQuery<Discussion[]>({
    queryKey: ["discussions", activeCategory, sortBy, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (sortBy) params.set("sort", sortBy);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await fetch(`/api/discussions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch discussions");
      return res.json();
    },
  });

  const createDiscussion = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          tags: newTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create discussion");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      setShowCreateForm(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("discussion");
      setNewTags("");
      toast.success("Discussion created!");
      router.push(`/nexus/${data.id}`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                Collaborative Network
              </span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase"
              >
                THE{" "}
                <span className="text-indigo-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                  NEXUS
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-slate-400 max-w-xl text-lg md:text-xl font-medium tracking-tight"
              >
                Peer-to-peer discussions for complex database engineering and
                architectural problem solving.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => {
                if (!session?.user) {
                  toast.error("Sign in to create a discussion");
                  return;
                }
                setShowCreateForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black italic tracking-wider px-8 h-14 rounded-2xl gap-3 shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              New Post
            </Button>
          </motion.div>
        </div>

        {/* Create Discussion Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-premium rounded-[2.5rem] p-8 space-y-6 border border-indigo-500/20"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">
                  New Discussion
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Input
                placeholder="Discussion title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white/5 border-white/10 h-14 rounded-2xl text-base font-medium px-6"
              />

              <textarea
                placeholder="Write your question or discussion..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl text-base font-medium px-6 py-4 resize-none focus:outline-none focus:border-indigo-500/50 text-white placeholder:text-slate-600"
              />

              <div className="flex flex-wrap gap-4">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 focus:outline-none focus:border-indigo-500/50"
                >
                  {CATEGORIES.filter((c) => c.name !== "all").map((c) => (
                    <option key={c.name} value={c.name} className="bg-slate-900">
                      {c.label}
                    </option>
                  ))}
                </select>

                <Input
                  placeholder="Tags (comma separated)..."
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl flex-1 min-w-[200px]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => createDiscussion.mutate()}
                  disabled={
                    !newTitle.trim() ||
                    !newContent.trim() ||
                    createDiscussion.isPending
                  }
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black italic tracking-wider px-8 h-12 rounded-xl gap-2"
                >
                  {createDiscussion.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {createDiscussion.isPending ? "Posting..." : "Post Discussion"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              placeholder="Search discussions by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none h-16 pl-16 pr-6 text-base font-medium focus:ring-0 placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2 p-2">
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-xl text-slate-400"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
            <Button
              variant="ghost"
              className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 font-bold text-[10px] uppercase tracking-widest gap-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["discussions"] })}
            >
              <Filter className="h-4 w-4" /> REFRESH
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
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <button
                  onClick={() => setSortBy("newest")}
                  className={
                    sortBy === "newest" ? "text-indigo-400" : "text-slate-700 hover:text-slate-500"
                  }
                >
                  NEWEST
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setSortBy("trending")}
                  className={
                    sortBy === "trending" ? "text-indigo-400" : "text-slate-700 hover:text-slate-500"
                  }
                >
                  TRENDING
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <MessageSquare className="h-12 w-12 text-slate-700 mx-auto" />
                <p className="text-slate-500 font-medium">
                  No discussions yet. Be the first to start one!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {discussions.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => router.push(`/nexus/${post.id}`)}
                      className="cursor-pointer"
                    >
                      <SpotlightCard className="group !p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                        <div className="p-8 space-y-6">
                          <div className="flex items-start gap-6">
                            <div className="hidden sm:flex flex-col items-center gap-3">
                              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black italic text-xl group-hover:scale-110 transition-transform duration-500">
                                {post.author?.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-[10px] font-black text-slate-500">
                                  {post.likes_count}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-indigo-400 transition-colors leading-[1.1]">
                                    {post.title}
                                  </h3>
                                  {post.is_solved && (
                                    <div className="shrink-0 h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                                  {post.content}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                                <div className="flex flex-wrap gap-2">
                                  {post.tags?.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="rounded-lg bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  <Badge
                                    variant="outline"
                                    className="rounded-lg bg-indigo-500/10 border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400"
                                  >
                                    {post.category}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                      {post.replies_count} Replies
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    <Clock className="h-3.5 w-3.5" />{" "}
                                    {timeAgo(post.created_at)}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-600">
                                    by {post.author?.name || "anonymous"}
                                  </span>
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
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Hash className="h-3 w-3" /> SECTOR_TAGS
              </h2>
              <div className="glass-premium p-4 rounded-[2.5rem] space-y-2">
                {CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`group w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer ${
                        activeCategory === cat.name ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center transition-colors ${
                            activeCategory === cat.name
                              ? "text-indigo-400"
                              : "group-hover:text-indigo-400"
                          }`}
                        >
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                            activeCategory === cat.name
                              ? "text-white"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <SpotlightCard className="!p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20 space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-black italic tracking-tighter uppercase">
                  Guidelines
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Maintain neural clarity by following sector standards.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "ALWAYS SPECIFY SQL_DIALECT",
                  "INCLUDE SAMPLE_DATA AND EXPECTED_OUTPUT",
                  "MARK_SOLVED WHEN ANSWERED",
                ].map((rule, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500"
                  >
                    <CheckCircle2 className="h-3 w-3 text-indigo-500 shrink-0" />
                    {rule}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}
