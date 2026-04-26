export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  language: "sql" | "python" | "pandas";
  starterCode: string;
  sampleDataSql: string;
  expectedOutput: Record<string, unknown>[];
  hints: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  query: string;
  isCorrect: boolean;
  executionTimeMs: number;
  submittedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  problemsSolved: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastActive: string;
  weakTopics: string[];
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  category: "basics" | "joins" | "aggregations" | "subqueries" | "window-functions";
  content: string;
  exampleQueries: string[];
  order: number;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  problemId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  executionTimeMs: number;
  expected?: Record<string, unknown>[];
  error?: string;
}
