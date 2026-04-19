"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  percentage: number;
  color: string;
}

const skills: Skill[] = [
  { name: "Joins", percentage: 85, color: "text-blue-500" },
  { name: "Aggregations", percentage: 62, color: "text-emerald-500" },
  { name: "Subqueries", percentage: 45, color: "text-amber-500" },
  { name: "Window Functions", percentage: 28, color: "text-purple-500" },
];

export function SkillProgress() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-medium text-muted-foreground">Skill Proficiency</h3>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-1">
        {skills.map((skill, index) => (
          <div key={skill.name} className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{skill.name}</p>
              <p className="text-xs text-muted-foreground">{skill.percentage}% Mastered</p>
            </div>
            <div className="relative h-12 w-12 shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-muted/20"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className={cn("stroke-current", skill.color)}
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${skill.percentage}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
