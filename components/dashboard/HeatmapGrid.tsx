"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface HeatmapDay {
  date: string;
  count: number;
}

const getColor = (count: number) => {
  if (count === 0) return "bg-slate-800/40 border-white/5";
  if (count === 1) return "bg-indigo-900/40 border-indigo-500/20";
  if (count === 2) return "bg-indigo-700/50 border-indigo-500/30";
  if (count === 3) return "bg-indigo-500/60 border-indigo-400/40";
  return "bg-indigo-400 border-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.4)]";
};

export function HeatmapGrid({ data }: { data?: HeatmapDay[] }) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Fallback: if no data passed, show empty 52-week grid
  const activityData = data && data.length > 0
    ? data
    : Array.from({ length: 52 * 7 }, (_, i) => ({
        date: new Date(Date.now() - (52 * 7 - i) * 86400000).toISOString().split("T")[0],
        count: 0,
      }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" /> Submission History
        </h3>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
          <span>Less</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((v) => (
              <div key={v} className={cn("h-3 w-3 rounded-sm border", getColor(v))} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="relative group/heatmap">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-4 scrollbar-hide">
          {activityData.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.0005 }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={cn(
                "h-3 w-3 rounded-sm transition-all duration-300 cursor-crosshair border",
                getColor(day.count),
                "hover:scale-150 hover:z-10"
              )}
            />
          ))}
        </div>
        
        {hoveredDay && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-20 whitespace-nowrap"
          >
            <div className="flex items-center gap-3">
              <div className={cn("h-2.5 w-2.5 rounded-full", getColor(hoveredDay.count))} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span className="text-white">{hoveredDay.count} PROBLEMS</span> SOLVED ON {new Date(hoveredDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
