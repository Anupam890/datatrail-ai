"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Sparkles } from "lucide-react";

interface Skill {
  name: string;
  percentage: number;
}

const skillColors = [
  "text-blue-400",
  "text-emerald-400",
  "text-amber-400",
  "text-purple-400",
  "text-rose-400",
  "text-cyan-400",
];

export function SkillProgress({ skills }: { skills?: Skill[] }) {
  const data = skills && skills.length > 0 ? skills : [];

  if (data.length === 0) {
    return (
      <SpotlightCard className="!p-8 rounded-[2.5rem] bg-slate-900/40 border-white/5 col-span-full">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">SKILL_COGNITION</h3>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest text-center py-8">
          Initialize problem protocols to build your skill profile.
        </p>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard className="!p-8 rounded-[3rem] bg-slate-900/40 border-white/5 col-span-full">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" /> SKILL_COGNITION
        </h3>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
          NEURAL_INDEXING: ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((skill, index) => (
          <motion.div 
            key={skill.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-5 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="relative h-16 w-16 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-white/5"
                  strokeWidth="3.5"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className={cn("stroke-current drop-shadow-[0_0_8px_currentColor]", skillColors[index % skillColors.length])}
                  strokeWidth="3.5"
                  strokeDasharray="100, 100"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${skill.percentage}, 100` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black italic tracking-tighter">{skill.percentage}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black italic uppercase tracking-tight group-hover:text-white transition-colors">{skill.name}</p>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Mastery Level</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SpotlightCard>
  );
}
