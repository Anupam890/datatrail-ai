"use client";

import { motion } from "framer-motion";
import type { AnimationTableState } from "./animation-data";

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

export function TableView({ table }: { table: AnimationTableState }) {
  const { data, highlightedRows, dimmedRows, highlightedCols, dimmedCols, isResult } = table;

  function cellClass(colName: string, rowIdx: number) {
    const classes = ["px-3 py-2 text-xs font-mono whitespace-nowrap transition-all duration-300"];

    if (dimmedRows?.includes(rowIdx)) {
      classes.push("opacity-20");
    } else if (highlightedRows?.includes(rowIdx)) {
      classes.push(isResult ? "text-emerald-300" : "text-indigo-300");
    } else {
      classes.push("text-slate-300");
    }

    if (dimmedCols?.includes(colName)) {
      classes.push("opacity-20");
    } else if (highlightedCols?.includes(colName)) {
      classes.push("bg-indigo-500/10");
    }

    return classes.join(" ");
  }

  function headerClass(colName: string) {
    const classes = [
      "px-3 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300",
    ];
    if (dimmedCols?.includes(colName)) {
      classes.push("text-slate-700");
    } else if (highlightedCols?.includes(colName)) {
      classes.push("text-indigo-400 bg-indigo-500/10");
    } else {
      classes.push("text-slate-500");
    }
    return classes.join(" ");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Table name label */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isResult ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {data.name}
        </span>
        {isResult && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Result
          </span>
        )}
      </div>

      <div
        className={`rounded-xl border overflow-hidden ${
          isResult
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-slate-800/50 bg-slate-900/30"
        }`}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              {data.columns.map((col) => (
                <th key={col} className={headerClass(col)}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                custom={rowIdx}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className={`border-b border-slate-800/30 last:border-0 transition-all duration-300 ${
                  highlightedRows?.includes(rowIdx) && !isResult
                    ? "bg-indigo-500/5"
                    : ""
                }`}
              >
                {data.columns.map((col) => (
                  <td key={col} className={cellClass(col, rowIdx)}>
                    {row[col] === null ? (
                      <span className="text-slate-600 italic">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
