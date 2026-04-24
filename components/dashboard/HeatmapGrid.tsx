"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HeatmapDay {
  date: string;
  count: number;
}

const getColor = (count: number) => {
  if (count === 0) return "bg-neutral-800";
  if (count === 1) return "bg-emerald-900";
  if (count === 2) return "bg-emerald-700";
  if (count === 3) return "bg-emerald-500";
  return "bg-emerald-400";
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
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Submission Activity</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-neutral-800" />
            <div className="h-3 w-3 rounded-sm bg-emerald-900" />
            <div className="h-3 w-3 rounded-sm bg-emerald-700" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
            <div className="h-3 w-3 rounded-sm bg-emerald-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {activityData.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.001 }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={cn(
                "h-3 w-3 rounded-sm transition-colors cursor-pointer",
                getColor(day.count)
              )}
            />
          ))}
        </div>
        
        {hoveredDay && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-xs shadow-lg border border-border z-10 whitespace-nowrap">
            <span className="font-bold">{hoveredDay.count} problems</span> on {new Date(hoveredDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
}
