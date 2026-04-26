"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AnimationTableState } from "./animation-data";
import { cn } from "@/lib/utils";

const rowVariants = {
  hidden: { opacity: 0, x: -4, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { 
      delay: i * 0.03, 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any
    },
  }),
};

export function TableView({ table }: { table: AnimationTableState }) {
  const { data, highlightedRows, dimmedRows, highlightedCols, dimmedCols, isResult } = table;

  function cellClass(colName: string, rowIdx: number) {
    const isDimmed = dimmedRows?.includes(rowIdx) || dimmedCols?.includes(colName);
    const isHighlighted = highlightedRows?.includes(rowIdx) || highlightedCols?.includes(colName);

    return cn(
      "px-4 py-3 text-[11px] font-mono whitespace-nowrap transition-all duration-500 relative z-10",
      isDimmed ? "opacity-20 grayscale" : "opacity-100",
      highlightedRows?.includes(rowIdx) 
        ? (isResult ? "text-emerald-300 font-bold" : "text-indigo-300 font-bold") 
        : "text-slate-400"
    );
  }

  function headerClass(colName: string) {
    const isDimmed = dimmedCols?.includes(colName);
    const isHighlighted = highlightedCols?.includes(colName);

    return cn(
      "px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500",
      isDimmed ? "text-slate-700" : isHighlighted ? "text-indigo-400" : "text-slate-500"
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
      className="w-full group"
    >
      {/* Table Metadata */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isResult ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-700"
          )} />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em] italic",
            isResult ? "text-emerald-400" : "text-slate-500"
          )}>
            {data.name}
          </span>
        </div>
        {isResult && (
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">
            Neural Output
          </div>
        )}
      </div>

      {/* Table Container */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden backdrop-blur-xl transition-all duration-700",
          isResult
            ? "border-emerald-500/20 bg-emerald-950/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
            : "border-white/5 bg-slate-900/40 group-hover:border-white/10"
        )}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {data.columns.map((col) => (
                  <th key={col} className={headerClass(col)}>
                    <div className="flex items-center gap-2">
                      {col}
                      {highlightedCols?.includes(col) && (
                        <motion.div 
                          layoutId={`col-highlight-${data.name}-${col}`}
                          className="w-1 h-1 rounded-full bg-indigo-500"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {data.rows.map((row, rowIdx) => {
                  const isHighlighted = highlightedRows?.includes(rowIdx);
                  return (
                    <motion.tr
                      key={`${rowIdx}-${JSON.stringify(row)}`}
                      custom={rowIdx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        "border-b border-white/[0.02] last:border-0 transition-colors duration-500 relative group/row",
                        isHighlighted && !isResult ? "bg-indigo-500/[0.03]" : "",
                        isHighlighted && isResult ? "bg-emerald-500/[0.03]" : ""
                      )}
                    >
                      {data.columns.map((col) => (
                        <td key={col} className={cellClass(col, rowIdx)}>
                          {row[col] === null ? (
                            <span className="text-slate-800 font-bold italic opacity-40">NULL</span>
                          ) : (
                            <span className="relative z-10">{String(row[col])}</span>
                          )}
                          
                          {/* Row Highlight Glow */}
                          {isHighlighted && (
                            <motion.div
                              layoutId={`row-glow-${data.name}-${rowIdx}`}
                              className={cn(
                                "absolute inset-0 z-0 opacity-40 pointer-events-none",
                                isResult ? "bg-emerald-500/5" : "bg-indigo-500/5"
                              )}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
