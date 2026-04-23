"use client";

import { create } from "zustand";

export interface ColumnInfo {
  name: string;
  type: string;
  description: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  hint: string;
  approach: string;
}

export interface DataAnalysis {
  summary: string;
  columns: ColumnInfo[];
  relationships: string[];
  insights: string[];
}

type Phase = "upload" | "analyzing" | "practice";

interface PlaygroundState {
  phase: Phase;
  csvData: Record<string, unknown>[];
  csvColumns: string[];
  tableName: string;
  fileName: string;
  analysis: DataAnalysis | null;
  questions: Question[];
  activeQuestion: Question | null;
  isGeneratingQuestions: boolean;
  aiHelp: string;
  isAiHelpLoading: boolean;

  setPhase: (phase: Phase) => void;
  loadCsv: (data: Record<string, unknown>[], columns: string[], fileName: string) => void;
  setTableName: (name: string) => void;
  setAnalysis: (analysis: DataAnalysis) => void;
  setQuestions: (questions: Question[]) => void;
  setActiveQuestion: (question: Question | null) => void;
  setIsGeneratingQuestions: (loading: boolean) => void;
  setAiHelp: (help: string) => void;
  setIsAiHelpLoading: (loading: boolean) => void;
  resetSession: () => void;
}

const initialState = {
  phase: "upload" as Phase,
  csvData: [] as Record<string, unknown>[],
  csvColumns: [] as string[],
  tableName: "data",
  fileName: "",
  analysis: null as DataAnalysis | null,
  questions: [] as Question[],
  activeQuestion: null as Question | null,
  isGeneratingQuestions: false,
  aiHelp: "",
  isAiHelpLoading: false,
};

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  loadCsv: (data, columns, fileName) =>
    set({
      csvData: data,
      csvColumns: columns,
      fileName,
      tableName: fileName.replace(/\.csv$/i, "").replace(/[^a-zA-Z0-9_]/g, "_"),
    }),

  setTableName: (tableName) => set({ tableName }),
  setAnalysis: (analysis) => set({ analysis }),
  setQuestions: (questions) => set({ questions }),
  setActiveQuestion: (question) => set({ activeQuestion: question }),
  setIsGeneratingQuestions: (isGeneratingQuestions) => set({ isGeneratingQuestions }),
  setAiHelp: (aiHelp) => set({ aiHelp }),
  setIsAiHelpLoading: (isAiHelpLoading) => set({ isAiHelpLoading }),

  resetSession: () => set(initialState),
}));
