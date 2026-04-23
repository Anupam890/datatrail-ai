"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/editor/results-table";
import { useAIChatStore } from "@/store";
import {
  ArrowLeft,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Send,
  Database,
  Terminal,
} from "lucide-react";
import type { QueryResult } from "@/types";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  { ssr: false, loading: () => <div className="h-[300px] rounded-xl border border-slate-800 bg-slate-900/50 animate-pulse" /> }
);

// Dummy problem data (would come from Supabase in production)
const problemsData: Record<string, {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  starterCode: string;
  sampleData: { table: string; columns: string[]; rows: string[][] }[];
  hints: string[];
}> = {
  "1": {
    title: "Select All Employees",
    description: "Write a query to select all columns from the **employees** table. Return all rows.",
    difficulty: "easy",
    topic: "basics",
    starterCode: "SELECT ",
    sampleData: [
      {
        table: "employees",
        columns: ["id", "name", "department", "salary", "hire_date"],
        rows: [
          ["1", "Alice Johnson", "Engineering", "120000", "2020-01-15"],
          ["2", "Bob Smith", "Engineering", "110000", "2020-03-20"],
          ["3", "Carol White", "Marketing", "90000", "2019-06-10"],
        ],
      },
    ],
    hints: [
      "Think about how to select everything from a table.",
      "Use the * wildcard to select all columns.",
      "The answer is: SELECT * FROM employees;",
    ],
  },
  "2": {
    title: "Filter by Department",
    description: "Find all employees who work in the **Engineering** department. Return all columns.",
    difficulty: "easy",
    topic: "basics",
    starterCode: "SELECT * FROM employees\nWHERE ",
    sampleData: [
      {
        table: "employees",
        columns: ["id", "name", "department", "salary"],
        rows: [
          ["1", "Alice Johnson", "Engineering", "120000"],
          ["2", "Bob Smith", "Engineering", "110000"],
          ["3", "Carol White", "Marketing", "90000"],
        ],
      },
    ],
    hints: [
      "Use a WHERE clause to filter results.",
      "Compare the department column to the string 'Engineering'.",
      "WHERE department = 'Engineering'",
    ],
  },
  "3": {
    title: "Count by Department",
    description: "Count the number of employees in each department. Show the **department** name and the **count**.",
    difficulty: "easy",
    topic: "aggregations",
    starterCode: "SELECT department, ",
    sampleData: [
      {
        table: "employees",
        columns: ["id", "name", "department"],
        rows: [
          ["1", "Alice Johnson", "Engineering"],
          ["2", "Bob Smith", "Engineering"],
          ["3", "Carol White", "Marketing"],
          ["4", "David Brown", "Sales"],
        ],
      },
    ],
    hints: [
      "You need to use GROUP BY.",
      "Use the COUNT() aggregate function.",
      "SELECT department, COUNT(*) FROM employees GROUP BY department;",
    ],
  },
  "5": {
    title: "Employee-Department Join",
    description: "Join the **employees** table with the **departments** table to show each employee's name, their department name, and the department location.",
    difficulty: "medium",
    topic: "joins",
    starterCode: "",
    sampleData: [
      {
        table: "employees",
        columns: ["id", "name", "department"],
        rows: [["1", "Alice Johnson", "Engineering"], ["2", "Bob Smith", "Marketing"]],
      },
      {
        table: "departments",
        columns: ["id", "name", "location"],
        rows: [["1", "Engineering", "San Francisco"], ["2", "Marketing", "New York"]],
      },
    ],
    hints: [
      "You need an INNER JOIN between the two tables.",
      "Match on employees.department = departments.name.",
      "SELECT e.name, d.name, d.location FROM employees e JOIN departments d ON e.department = d.name;",
    ],
  },
  "9": {
    title: "Salary Ranking",
    description: "Rank all employees by salary within their department using the **RANK()** window function. Show **name**, **department**, **salary**, and **rank**.",
    difficulty: "hard",
    topic: "window-functions",
    starterCode: "",
    sampleData: [
      {
        table: "employees",
        columns: ["id", "name", "department", "salary"],
        rows: [
          ["1", "Alice Johnson", "Engineering", "120000"],
          ["5", "Eve Davis", "Engineering", "130000"],
          ["9", "Ivy Chen", "Engineering", "115000"],
        ],
      },
    ],
    hints: [
      "Use the RANK() window function.",
      "PARTITION BY department and ORDER BY salary DESC.",
      "RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank",
    ],
  },
};

const difficultyColor = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const difficultyDot = {
  easy: "bg-emerald-500",
  medium: "bg-amber-500",
  hard: "bg-rose-500",
};

export default function ArenaProblemPage() {
  const params = useParams();
  const problemSlug = params.problemSlug as string;
  const problem = problemsData[problemSlug];

  const [code, setCode] = useState(problem?.starterCode || "");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintText, setHintText] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const { togglePanel } = useAIChatStore();

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-black italic text-slate-700">404</h1>
        <p className="text-slate-500 font-medium tracking-tight">Problem not found</p>
        <Link href="/arena">
          <Button variant="outline" className="border-slate-800 mt-2">Back to Arena</Button>
        </Link>
      </div>
    );
  }

  async function handleRun() {
    if (!code.trim()) return;
    setLoading(true);
    setSubmitted(false);
    setResult(null);

    try {
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: code.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ columns: [], rows: [], executionTimeMs: 0, error: "Failed to execute query" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    await handleRun();
    setSubmitted(true);
    if (result && !result.error && result.rows.length > 0) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }

  async function handleHint() {
    const nextLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(nextLevel);
    setHintLoading(true);

    if (problem.hints[nextLevel - 1]) {
      setHintText(problem.hints[nextLevel - 1]);
      setHintLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          problem: problem.description,
          level: nextLevel,
        }),
      });
      const data = await res.json();
      setHintText(data.result || "No hint available");
    } catch {
      setHintText("Failed to get hint. Try again.");
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[25%] h-[25%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/arena">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{problem.title}</h1>
            <Badge variant="outline" className={`capitalize text-[10px] gap-1.5 ${difficultyColor[problem.difficulty]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${difficultyDot[problem.difficulty]}`} />
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize text-[10px] border-slate-800 text-slate-400">
              {problem.topic.replace("-", " ")}
            </Badge>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Problem Description */}
            <Card className="bg-slate-900/30 border-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-500" />
                  Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-300">{problem.description}</p>
              </CardContent>
            </Card>

            {/* Sample Data */}
            {problem.sampleData.map((dataset) => (
              <Card key={dataset.table} className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
                <CardHeader className="pb-2 bg-slate-900/50">
                  <CardTitle className="text-xs font-mono flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-indigo-400">{dataset.table}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/30">
                          {dataset.columns.map((col) => (
                            <th key={col} className="px-4 py-2.5 text-left font-mono font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.rows.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors">
                            {row.map((cell, cidx) => (
                              <td key={cidx} className="px-4 py-2 font-mono text-slate-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2 border-t border-slate-800/50">
                    <p className="text-[10px] text-slate-600">Showing {dataset.rows.length} sample rows</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Hint */}
            <AnimatePresence>
              {hintText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-amber-500/5 border-amber-500/10 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <span className="text-sm font-bold text-amber-400">Hint {hintLevel}/3</span>
                        {/* Hint progress dots */}
                        <div className="flex items-center gap-1 ml-auto">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                level <= hintLevel ? "bg-amber-400" : "bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{hintText}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Editor + Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            {/* Editor */}
            <Card className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">query.sql</span>
                <span className="text-[10px] text-slate-600 ml-auto font-mono">Ctrl+Enter to run</span>
              </div>
              <CardContent className="p-0">
                <SQLEditor value={code} onChange={setCode} onRun={handleRun} height="300px" />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handleRun}
                disabled={loading}
                variant="outline"
                className="gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 rounded-xl h-10"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 text-emerald-400" />}
                Run
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 shadow-lg shadow-indigo-500/20"
              >
                <Send className="h-4 w-4" />
                Submit
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHint}
                  disabled={hintLoading || hintLevel >= 3}
                  className="gap-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl"
                >
                  <Lightbulb className="h-4 w-4" />
                  {hintLoading ? "Loading..." : `Hint (${hintLevel}/3)`}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePanel}
                  className="gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl"
                >
                  <Sparkles className="h-4 w-4" /> AI Help
                </Button>
              </div>
            </div>

            {/* Submission Result */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                >
                  <Card className={`overflow-hidden ${
                    isCorrect
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-rose-500/5 border-rose-500/20"
                  }`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      {isCorrect ? (
                        <>
                          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold text-emerald-400">Correct!</p>
                            <p className="text-xs text-slate-400">Your query produces the expected output.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                            <XCircle className="h-5 w-5 text-rose-400" />
                          </div>
                          <div>
                            <p className="font-bold text-rose-400">Incorrect</p>
                            <p className="text-xs text-slate-400">Check your query and try again. Use hints if needed.</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {result && <ResultsTable result={result} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
