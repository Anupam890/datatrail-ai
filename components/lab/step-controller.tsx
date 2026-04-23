"use client";

import { Button } from "@/components/ui/button";
import { useLabStore } from "@/store/use-lab-store";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

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
  } = useLabStore();

  const isFirst = currentStep === 0;
  const isLast = currentStep >= totalSteps - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Step dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => useLabStore.getState().goToStep(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep
                ? "w-6 bg-indigo-500"
                : i < currentStep
                ? "w-2 bg-indigo-500/40"
                : "w-2 bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevStep}
          disabled={isFirst}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? pause : play}
          disabled={isLast && !isPlaying}
          className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextStep}
          disabled={isLast}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={replay}
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Speed toggle */}
      <div className="flex items-center gap-1 ml-1">
        {([1, 2] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
              playbackSpeed === s
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Step label */}
      <span className="text-[10px] text-slate-500 ml-auto">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}
