"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLabStore } from "@/store/use-lab-store";
import { animationsByCategory, type AnimationStep } from "./animation-data";
import { TableView } from "./table-view";
import { StepController } from "./step-controller";
import { Eye } from "lucide-react";

interface ConceptVisualizerProps {
  category: string;
}

export function ConceptVisualizer({ category }: ConceptVisualizerProps) {
  const steps = animationsByCategory[category] ?? [];
  const { currentStep, isPlaying, playbackSpeed, setTotalSteps, nextStep, pause } = useLabStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize step count when category changes
  useEffect(() => {
    setTotalSteps(steps.length);
  }, [category, steps.length, setTotalSteps]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      const ms = playbackSpeed === 2 ? 1200 : 2400;
      intervalRef.current = setInterval(() => {
        nextStep();
      }, ms);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackSpeed, nextStep]);

  // Pause when reaching end
  useEffect(() => {
    if (currentStep >= steps.length - 1 && isPlaying) {
      pause();
    }
  }, [currentStep, steps.length, isPlaying, pause]);

  if (steps.length === 0) return null;

  const step: AnimationStep = steps[currentStep] ?? steps[0];

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Concept Visualizer
        </span>
      </div>

      {/* Animation canvas */}
      <div className="rounded-2xl border border-slate-800/50 bg-slate-950/50 p-6 min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                {step.label}
              </span>
            </div>

            {/* Tables */}
            <div
              className={`flex gap-6 ${
                step.tables.length > 1 ? "flex-col md:flex-row" : ""
              }`}
            >
              {step.tables.map((t, i) => (
                <div key={i} className={step.tables.length > 1 ? "flex-1 min-w-0" : "w-full"}>
                  <TableView table={t} />
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <StepController />
    </div>
  );
}
