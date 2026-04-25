"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle2, XCircle, ChevronRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  query: string;
  status: "accepted" | "wrong" | "error";
  execution_time: number;
  created_at: string;
  error_message?: string;
}

interface SubmissionHistoryProps {
  problemSlug: string;
  onSelect?: (query: string) => void;
}

export function SubmissionHistory({ problemSlug, onSelect }: SubmissionHistoryProps) {
  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["submissions", "history", problemSlug],
    queryFn: async () => {
      const res = await fetch(`/api/submissions?problemSlug=${problemSlug}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-white/[0.02] border border-white/5" />
        ))}
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center opacity-20">
        <Clock className="h-8 w-8 mb-2" />
        <p className="text-[10px] font-bold uppercase tracking-widest">No Submissions Yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((sub) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={sub.id}
          onClick={() => onSelect?.(sub.query)}
          className={cn(
            "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
            "hover:bg-white/[0.02] active:scale-[0.98]",
            sub.status === "accepted" 
              ? "bg-emerald-500/[0.01] border-emerald-500/10 hover:border-emerald-500/20" 
              : "bg-rose-500/[0.01] border-rose-500/10 hover:border-rose-500/20"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              sub.status === "accepted" ? "bg-emerald-500/10" : "bg-rose-500/10"
            )}>
              {sub.status === "accepted" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400" />
              )}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className={cn(
                "text-xs font-bold capitalize",
                sub.status === "accepted" ? "text-emerald-400" : "text-rose-400"
              )}>
                {sub.status === "wrong" ? "Wrong Answer" : sub.status}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {new Date(sub.created_at).toLocaleString([], { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[11px] font-mono text-slate-300">{sub.execution_time?.toFixed(1) || 0}ms</span>
              {sub.error_message && (
                <span className="text-[9px] text-rose-400/70 truncate max-w-[100px]">
                  {sub.error_message}
                </span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
