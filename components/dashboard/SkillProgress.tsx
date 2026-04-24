"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  percentage: number;
}

const skillColors = [
  "text-blue-500",
  "text-emerald-500",
  "text-amber-500",
  "text-purple-500",
  "text-rose-500",
  "text-cyan-500",
];

export function SkillProgress({ skills }: { skills?: Skill[] }) {
  const data = skills && skills.length > 0
    ? skills
    : [];

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm col-span-full">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Skill Proficiency</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          Solve problems to build your skill profile.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm col-span-full">
      <h3 className="mb-6 text-sm font-medium text-muted-foreground">Skill Proficiency</h3>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-1">
        {data.map((skill, index) => (
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
                  className={cn("stroke-current", skillColors[index % skillColors.length])}
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
