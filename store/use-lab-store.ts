import { create } from "zustand";

interface LabStore {
  // Animation state
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: 1 | 2;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  play: () => void;
  pause: () => void;
  replay: () => void;
  setSpeed: (speed: 1 | 2) => void;
  setTotalSteps: (total: number) => void;

  // Track expand/collapse on listing page
  expandedTrackSlug: string | null;
  toggleTrack: (slug: string) => void;
}

export const useLabStore = create<LabStore>((set, get) => ({
  currentStep: 0,
  totalSteps: 0,
  isPlaying: false,
  playbackSpeed: 1,

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  goToStep: (step) => set({ currentStep: step }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  replay: () => set({ currentStep: 0, isPlaying: true }),
  setSpeed: (speed) => set({ playbackSpeed: speed }),
  setTotalSteps: (total) => set({ totalSteps: total, currentStep: 0, isPlaying: false }),

  expandedTrackSlug: null,
  toggleTrack: (slug) =>
    set((state) => ({
      expandedTrackSlug: state.expandedTrackSlug === slug ? null : slug,
    })),
}));
