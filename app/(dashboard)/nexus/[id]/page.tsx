"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  Sparkles,
  Hash,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { toast } from "sonner";

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
  updated_at: string;
  user_id: string;
  author: { id: string; name: string; image: string | null } | null;
}

interface Reply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  likes_count: number;
  created_at: string;
  author: { id: string; name: string; image: string | null } | null;
}

interface VoteStatus {
  discussionVoted: boolean;
  votedReplyIds: string[];
}

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [replyContent, setReplyContent] = useState("");

  // Fetch discussion
  const { data: discussion, isLoading: loadingDiscussion } = useQuery<Discussion>({
    queryKey: ["discussion", id],
    queryFn: async () => {
      const res = await fetch(`/api/discussions/${id}`);
      if (!res.ok) throw new Error("Discussion not found");
      return res.json();
    },
  });

  // Fetch replies
  const { data: replies = [] } = useQuery<Reply[]>({
    queryKey: ["discussion-replies", id],
    queryFn: async () => {
      const res = await fetch(`/api/discussions/${id}/replies`);
      if (!res.ok) throw new Error("Failed to fetch replies");
      return res.json();
    },
  });

  // Fetch vote status
  const { data: voteStatus } = useQuery<VoteStatus>({
    queryKey: ["discussion-votes", id],
    queryFn: async () => {
      const res = await fetch(`/api/discussions/${id}/vote`);
      if (!res.ok) return { discussionVoted: false, votedReplyIds: [] };
      return res.json();
    },
    enabled: !!session?.user,
  });

  // Vote on discussion
  const voteMutation = useMutation({
    mutationFn: async ({
      targetType,
      targetId,
    }: {
      targetType: "discussion" | "reply";
      targetId: string;
    }) => {
      const res = await fetch(`/api/discussions/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      if (!res.ok) throw new Error("Vote failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", id] });
      queryClient.invalidateQueries({ queryKey: ["discussion-votes", id] });
    },
  });

  // Post reply
  const replyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/discussions/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post reply");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", id] });
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
      setReplyContent("");
      toast.success("Reply posted!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Mark as solved
  const solveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_solved: !discussion?.is_solved }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion", id] });
      toast.success(
        discussion?.is_solved ? "Marked as unsolved" : "Marked as solved!"
      );
    },
  });

  const isAuthor = session?.user?.id === discussion?.user_id;
  const discussionVoted = voteStatus?.discussionVoted ?? false;
  const votedReplyIds = voteStatus?.votedReplyIds ?? [];

  if (loadingDiscussion) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Discussion not found</p>
        <Button onClick={() => router.push("/nexus")} variant="ghost">
          Back to Nexus
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.push("/nexus")}
            className="gap-2 text-slate-400 hover:text-white rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to Nexus
            </span>
          </Button>
        </motion.div>

        {/* Discussion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SpotlightCard className="!p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5">
            <div className="p-8 md:p-10 space-y-8">
              {/* Author + meta header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black italic text-lg">
                    {discussion.author?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {discussion.author?.name || "anonymous"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {timeAgo(discussion.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {discussion.is_solved && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black uppercase text-[9px] tracking-widest rounded-lg gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Solved
                    </Badge>
                  )}
                  {isAuthor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => solveMutation.mutate()}
                      disabled={solveMutation.isPending}
                      className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-1 text-slate-400 hover:text-emerald-400"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      {discussion.is_solved ? "Unsolve" : "Mark Solved"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-[1.1]">
                {discussion.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-lg bg-indigo-500/10 border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400"
                >
                  {discussion.category}
                </Badge>
                {discussion.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-lg bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400"
                  >
                    <Hash className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Content */}
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                {discussion.content}
              </div>

              {/* Actions bar */}
              <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!session?.user) {
                      toast.error("Sign in to vote");
                      return;
                    }
                    voteMutation.mutate({
                      targetType: "discussion",
                      targetId: discussion.id,
                    });
                  }}
                  className={`rounded-xl gap-2 font-black text-xs ${
                    discussionVoted
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-slate-500 hover:text-indigo-400"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {discussion.likes_count}
                </Button>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <MessageCircle className="h-4 w-4" />
                  {replies.length} Replies
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Replies Section */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 px-2">
            <MessageCircle className="h-3 w-3" /> Replies
          </h2>

          <AnimatePresence mode="popLayout">
            {replies.map((reply, i) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="glass-premium rounded-[2rem] p-6 md:p-8 space-y-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black italic text-sm">
                        {reply.author?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {reply.author?.name || "anonymous"}
                        </p>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {timeAgo(reply.created_at)}
                        </span>
                      </div>
                    </div>

                    {reply.is_accepted && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Accepted
                      </Badge>
                    )}
                  </div>

                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                    {reply.content}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (!session?.user) {
                          toast.error("Sign in to vote");
                          return;
                        }
                        voteMutation.mutate({
                          targetType: "reply",
                          targetId: reply.id,
                        });
                      }}
                      className={`rounded-xl gap-2 font-black text-xs ${
                        votedReplyIds.includes(reply.id)
                          ? "text-indigo-400 bg-indigo-500/10"
                          : "text-slate-500 hover:text-indigo-400"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {reply.likes_count}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {replies.length === 0 && (
            <div className="text-center py-12 text-slate-600 font-medium">
              No replies yet. Be the first to respond!
            </div>
          )}
        </div>

        {/* Reply Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="!p-0 rounded-[2.5rem] bg-slate-900/40 border-white/5">
            <div className="p-8 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Post a Reply
              </h3>

              {session?.user ? (
                <>
                  <textarea
                    placeholder="Share your insight..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl text-sm font-medium px-6 py-4 resize-none focus:outline-none focus:border-indigo-500/50 text-white placeholder:text-slate-600"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => replyMutation.mutate()}
                      disabled={
                        !replyContent.trim() || replyMutation.isPending
                      }
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black italic tracking-wider px-6 h-11 rounded-xl gap-2"
                    >
                      {replyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {replyMutation.isPending ? "Sending..." : "Reply"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-sm font-medium">
                  Sign in to post a reply.
                </p>
              )}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
