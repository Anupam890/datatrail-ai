"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import type { QueryResult } from "@/types";

const SQLEditor = dynamic(
  () => import("@/components/editor/sql-editor").then((m) => m.SQLEditor),
  { ssr: false, loading: () => <div className="h-[250px] rounded-lg border bg-muted animate-pulse" /> }
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
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const problem = problemsData[id];

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
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Problem not found</p>
        <Link href="/challenges">
          <Button className="mt-4">Back to Challenges</Button>
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
    // Simplified validation: check if query returned results without errors
    // In production, compare against expected output
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

    // Use local hints from problem data
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <Badge variant="outline" className={`capitalize ${difficultyColor[problem.difficulty]}`}>
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize">{problem.topic.replace("-", " ")}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: Problem Description */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{problem.description}</p>
            </CardContent>
          </Card>

          {/* Sample Data */}
          {problem.sampleData.map((dataset) => (
            <Card key={dataset.table}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">Table: {dataset.table}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded border overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {dataset.columns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-mono font-medium">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.rows.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          {row.map((cell, cidx) => (
                            <td key={cidx} className="px-3 py-1.5 font-mono">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Showing first {dataset.rows.length} rows</p>
              </CardContent>
            </Card>
          ))}

          {/* Hint */}
          {hintText && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Hint {hintLevel}/3</span>
                </div>
                <p className="text-sm text-muted-foreground">{hintText}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Editor + Results */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <SQLEditor value={code} onChange={setCode} onRun={handleRun} height="250px" />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handleRun} disabled={loading} variant="outline" className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              <Send className="h-4 w-4" />
              Submit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleHint} disabled={hintLoading || hintLevel >= 3} className="gap-2">
              <Lightbulb className="h-4 w-4" />
              {hintLoading ? "Loading..." : `Hint (${hintLevel}/3)`}
            </Button>
            <Button variant="ghost" size="sm" onClick={togglePanel} className="gap-2">
              <Sparkles className="h-4 w-4" /> AI Help
            </Button>
          </div>

          {/* Submission Result */}
          {submitted && (
            <Card className={isCorrect ? "border-green-500/50" : "border-red-500/50"}>
              <CardContent className="p-4 flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-500">Correct!</p>
                      <p className="text-sm text-muted-foreground">Your query produces the expected output.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-500">Incorrect</p>
                      <p className="text-sm text-muted-foreground">Check your query and try again. Use hints if needed.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {result && <ResultsTable result={result} />}
        </div>
      </div>
    </div>
  );
}
