"use client";

import { Button } from "@/components/ui/button";
import { useLabStore } from "@/store/use-lab-store";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  FastForward,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StepController() {
  const {
    currentStep,
    totalSteps,
    isPlaying,
    playbackSpeed,
    nextStep,
    prevStep,
    play,
    pause,
    replay,
    setSpeed,
    goToStep,
  } = useLabStore();

  const isFirst = currentStep === 0;
  const isLast = currentStep >= totalSteps - 1;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-[2.5rem] w-fit mx-auto">
      {/* Progress Monitor */}
      <div className="flex flex-col gap-2 min-w-[120px]">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Progress</span>
          <span className="text-[10px] font-mono text-indigo-400">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="flex items-center gap-1.5 h-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className="relative group h-full flex items-center"
            >
              <motion.div
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === currentStep
                    ? "w-6 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    : i < currentStep
                    ? "w-2 bg-indigo-500/40"
                    : "w-2 bg-slate-800"
                )}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-800 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white whitespace-nowrap">
                  Step {i + 1}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Control Cluster */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevStep}
          disabled={isFirst}
          className="h-10 w-10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? pause : play}
          disabled={isLast && !isPlaying}
          className={cn(
            "h-14 w-14 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center relative group",
            isPlaying 
              ? "bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
              : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
          )}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 ml-1 fill-current" />
          )}
          
          {/* Subtle pulse when playing */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-[1.5rem] border border-indigo-400 animate-ping opacity-20" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextStep}
          disabled={isLast}
          className="h-10 w-10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-white/5 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={replay}
          className="h-10 w-10 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Temporal Velocity */}
      <div className="flex flex-col gap-2 min-w-[100px]">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Temporal Velocity</span>
        <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-xl border border-white/5">
          {([1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-[9px] font-black transition-all",
                playbackSpeed === s
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-400"
              )}
            >
              {s === 2 && <FastForward className="w-3 h-3" />}
              {s}X
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
