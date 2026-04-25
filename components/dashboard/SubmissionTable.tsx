"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Fingerprint } from "lucide-react";
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
  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}D AGO`;
  const months = Math.floor(days / 30);
  return `${months}MO AGO`;
}

export function SubmissionTable({ submissions }: { submissions?: Submission[] }) {
  const data = submissions || [];

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/20 backdrop-blur-xl border border-white/5">
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
          <Fingerprint className="h-3.5 w-3.5" /> RECENT_SUBMISSIONS
        </h3>
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400">
          LOG_COUNT: {data.length}
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="px-8 py-20 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No submission logs found in primary database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-5 font-black">PROBLEM_NODE</th>
                <th className="px-8 py-5 font-black">STATUS_PROTOCOL</th>
                <th className="px-8 py-5 font-black">DIFFICULTY_INDEX</th>
                <th className="px-8 py-5 font-black text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((sub, index) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/[0.03] transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <span className="text-sm font-black italic tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">
                      {sub.problems?.title || "UNKNOWN_NODE"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {sub.status === "accepted" ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ACCEPTED</span>
                        </>
                      ) : sub.status === "error" ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">ERROR</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">REJECTED</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black px-2.5 py-1 rounded-lg border tracking-widest uppercase leading-none",
                      sub.problems?.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                      sub.problems?.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
                      sub.problems?.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                      {sub.problems?.difficulty || "—"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Clock className="h-3.5 w-3.5" />
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
