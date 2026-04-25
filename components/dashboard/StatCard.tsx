"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo";
  description?: string;
}

const colorMap = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  suffix = "", 
  prefix = "", 
  color = "blue",
  description 
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-white/10"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </span>
          </div>
          {description && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{description}</p>
          )}
        </div>
        <div className={cn("rounded-2xl p-3 shrink-0 transition-transform group-hover:scale-110 duration-500", colorMap[color as keyof typeof colorMap] || colorMap.blue)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Dynamic glow effect */}
      <div className={cn(
        "absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20",
        color === "blue" && "bg-blue-500",
        color === "emerald" && "bg-emerald-500",
        color === "amber" && "bg-amber-500",
        color === "rose" && "bg-rose-500",
        color === "purple" && "bg-purple-500",
        color === "indigo" && "bg-indigo-500",
      )} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    </motion.div>
  );
}
