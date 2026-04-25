
/**
 * DataTrail AI Premium Color Palette
 * Consistent color system for the overall project
 */

export const colors = {
  // Base Surfaces
  background: {
    DEFAULT: "#0A0A0A",
    subtle: "#0F0F0F",
    card: "#141414",
    active: "#1A1A1A",
    loading: "#0B0F19",
  },

  // Borders & Dividers
  border: {
    subtle: "rgba(255, 255, 255, 0.05)",
    muted: "rgba(255, 255, 255, 0.1)",
    active: "rgba(255, 255, 255, 0.2)",
  },

  // Brand / Primary (Indigo)
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1", // Brand color
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
    glow: "rgba(99, 102, 241, 0.15)",
  },

  // Status Colors
  success: {
    text: "#34D399", // emerald-400
    background: "rgba(52, 211, 153, 0.1)",
    border: "rgba(52, 211, 153, 0.2)",
    dot: "#10B981", // emerald-500
  },
  warning: {
    text: "#FBBF24", // amber-400
    background: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.2)",
    dot: "#F59E0B", // amber-500
  },
  danger: {
    text: "#FB7185", // rose-400
    background: "rgba(251, 113, 133, 0.1)",
    border: "rgba(251, 113, 133, 0.2)",
    dot: "#F43F5E", // rose-500
  },

  // Neutrals (Slate)
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8", // Main secondary text
    500: "#64748B", // Muted text/icons
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Specialized
  ai: {
    primary: "#818CF8", // Indigo-400
    glow: "rgba(129, 140, 248, 0.1)",
  },
  premium: {
    gold: "#F59E0B", // amber-500
    glow: "rgba(245, 158, 11, 0.1)",
  }
};

export type ColorTheme = typeof colors;
