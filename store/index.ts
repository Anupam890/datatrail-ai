import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface AIChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  togglePanel: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}));

interface EditorState {
  code: string;
  setCode: (code: string) => void;
  queryHistory: string[];
  addToHistory: (query: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: "SELECT * FROM employees LIMIT 10;",
  setCode: (code) => set({ code }),
  queryHistory: [],
  addToHistory: (query) =>
    set((state) => ({
      queryHistory: [query, ...state.queryHistory].slice(0, 50),
    })),
}));
