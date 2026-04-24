"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: number;
  status: string;
  created_at: string;
  execution_time?: number;
  problems?: {
    title: string;
    slug: string;
    difficulty: string;
    tags?: string[];
  };
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function SubmissionTable({ submissions }: { submissions?: Submission[] }) {
  const data = submissions || [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
        <h3 className="text-sm font-medium">Recent Submissions</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          No submissions yet. Start solving problems!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Problem</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Difficulty</th>
                <th className="px-6 py-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((sub, index) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                      {sub.problems?.title || "Unknown Problem"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {sub.status === "accepted" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-500">Accepted</span>
                        </>
                      ) : sub.status === "error" ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-medium text-amber-500">Error</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-rose-500" />
                          <span className="text-xs font-medium text-rose-500">Wrong Answer</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border",
                      sub.problems?.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                      sub.problems?.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
                      sub.problems?.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                      {sub.problems?.difficulty || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo(sub.created_at)}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
