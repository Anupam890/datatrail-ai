"use client";

import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
  description?: string;
}

const colorMap = {
  blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
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
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn("rounded-lg border p-2.5", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {/* Subtle background glow */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
        color === "blue" && "bg-blue-500",
        color === "emerald" && "bg-emerald-500",
        color === "amber" && "bg-amber-500",
        color === "rose" && "bg-rose-500",
        color === "purple" && "bg-purple-500",
      )} />
    </motion.div>
  );
}
