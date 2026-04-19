"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const submissions = [
  { id: 1, name: "Employee Salary Gap", status: "Accepted", difficulty: "Medium", time: "2m ago" },
  { id: 2, name: "Top 3 Products per Category", status: "Accepted", difficulty: "Hard", time: "1h ago" },
  { id: 3, name: "Customer Churn Analysis", status: "Wrong Answer", difficulty: "Hard", time: "3h ago" },
  { id: 4, name: "Find Duplicates in Orders", status: "Accepted", difficulty: "Easy", time: "1d ago" },
  { id: 5, name: "Department Wise Average", status: "Accepted", difficulty: "Easy", time: "2d ago" },
];

export function SubmissionTable() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
        <h3 className="text-sm font-medium">Recent Submissions</h3>
      </div>
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
            {submissions.map((sub, index) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">{sub.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {sub.status === "Accepted" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">Accepted</span>
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
                    sub.difficulty === "Easy" && "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                    sub.difficulty === "Medium" && "text-amber-500 bg-amber-500/10 border-amber-500/20",
                    sub.difficulty === "Hard" && "text-rose-500 bg-rose-500/10 border-rose-500/20"
                  )}>
                    {sub.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{sub.time}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
