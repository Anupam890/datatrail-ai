"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Terminal,
  Play,
} from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SQLEditor } from "@/components/editor/sql-editor";
import { ResultsTable } from "@/components/editor/results-table";
import { ConceptVisualizer } from "@/components/lab/concept-visualizer";
import type { QueryResult } from "@/types";

// ─── Lesson data (unchanged) ───────────────────────────────────────────────

const lessonsData: Record<
  string,
  {
    title: string;
    category: string;
    content: string[];
    examples: { title: string; sql: string; explanation: string }[];
    starterCode: string;
    prevSlug?: string;
    nextSlug?: string;
  }
> = {
  "intro-to-sql": {
    title: "Introduction to SQL",
    category: "basics",
    content: [
      "SQL (Structured Query Language) is the standard language for interacting with relational databases. It allows you to query, insert, update, and delete data.",
      "The SELECT statement is the most fundamental SQL command. It retrieves data from one or more tables.",
      "The WHERE clause filters rows based on conditions. You can use comparison operators (=, <, >, !=), logical operators (AND, OR, NOT), and pattern matching (LIKE).",
      "ORDER BY sorts results by one or more columns. Use ASC for ascending (default) or DESC for descending. LIMIT restricts the number of rows returned.",
    ],
    examples: [
      { title: "Select All Columns", sql: "SELECT * FROM employees;", explanation: "The asterisk (*) selects every column from the employees table." },
      { title: "Filter with WHERE", sql: "SELECT name, salary\nFROM employees\nWHERE department = 'Engineering'\n  AND salary > 100000;", explanation: "Filters employees in Engineering with salary above 100k. AND requires both conditions to be true." },
      { title: "Sort and Limit", sql: "SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;", explanation: "Returns the top 5 highest-paid employees. DESC sorts from highest to lowest." },
    ],
    starterCode: "SELECT name, salary\nFROM employees\nWHERE department = 'Engineering';",
    nextSlug: "working-with-joins",
  },
  "working-with-joins": {
    title: "Working with JOINs",
    category: "joins",
    content: [
      "JOINs combine rows from two or more tables based on a related column. They are essential for working with normalized databases.",
      "INNER JOIN returns only rows that have matching values in both tables. This is the most common type of join.",
      "LEFT JOIN returns all rows from the left table and matched rows from the right. Unmatched rows from the right side show NULL values.",
      "Self JOINs join a table with itself. This is useful for hierarchical data like employee-manager relationships.",
    ],
    examples: [
      { title: "INNER JOIN", sql: "SELECT e.name, d.name AS department, d.location\nFROM employees e\nINNER JOIN departments d\n  ON e.department = d.name;", explanation: "Combines employees with departments. Only employees with matching department names are returned." },
      { title: "LEFT JOIN", sql: "SELECT c.name, o.product\nFROM customers c\nLEFT JOIN orders o\n  ON c.name = o.customer_name;", explanation: "Returns ALL customers, even those without orders. Customers with no orders show NULL for product." },
      { title: "Self JOIN", sql: "SELECT e.name AS employee,\n       m.name AS manager\nFROM employees e\nJOIN employees m\n  ON e.manager_id = m.id;", explanation: "Joins employees table with itself to find each employee's manager using manager_id." },
    ],
    starterCode: "SELECT e.name, d.name AS department\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.id;",
    prevSlug: "intro-to-sql",
    nextSlug: "aggregate-functions",
  },
  "aggregate-functions": {
    title: "Aggregate Functions",
    category: "aggregations",
    content: [
      "Aggregate functions perform calculations on a set of values and return a single result. Common functions include COUNT, SUM, AVG, MIN, and MAX.",
      "GROUP BY groups rows with the same values into summary rows. Every non-aggregated column in SELECT must appear in GROUP BY.",
      "HAVING filters groups after aggregation (like WHERE but for groups). Use WHERE to filter individual rows before grouping.",
    ],
    examples: [
      { title: "COUNT and GROUP BY", sql: "SELECT department, COUNT(*) AS emp_count\nFROM employees\nGROUP BY department;", explanation: "Counts employees per department. COUNT(*) counts all rows in each group." },
      { title: "AVG with HAVING", sql: "SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 100000;", explanation: "Shows departments with average salary above 100k. HAVING filters after grouping." },
    ],
    starterCode: "SELECT department, COUNT(*) AS emp_count\nFROM employees\nGROUP BY department;",
    prevSlug: "working-with-joins",
    nextSlug: "subqueries",
  },
  subqueries: {
    title: "Subqueries",
    category: "subqueries",
    content: [
      "A subquery is a query nested inside another query. They can appear in SELECT, FROM, WHERE, and HAVING clauses.",
      "Scalar subqueries return a single value and can be used with comparison operators in WHERE clauses.",
      "Correlated subqueries reference the outer query and execute once for each row processed by the outer query.",
      "EXISTS checks if a subquery returns any rows. It's efficient for checking existence without returning actual data.",
    ],
    examples: [
      { title: "WHERE Subquery", sql: "SELECT name, salary\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary) FROM employees\n);", explanation: "Finds employees earning above average. The subquery calculates the average first, then the outer query filters." },
      { title: "Correlated Subquery", sql: "SELECT e.name, e.salary,\n  (SELECT MAX(salary)\n   FROM employees e2\n   WHERE e2.department = e.department\n  ) AS dept_max\nFROM employees e;", explanation: "For each employee, finds the max salary in their department. The subquery runs once per outer row." },
    ],
    starterCode: "SELECT name, salary\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary) FROM employees\n);",
    prevSlug: "aggregate-functions",
    nextSlug: "window-functions",
  },
  "window-functions": {
    title: "Window Functions",
    category: "window-functions",
    content: [
      "Window functions perform calculations across a set of rows related to the current row without collapsing them into groups.",
      "The OVER clause defines the window. PARTITION BY divides rows into groups, and ORDER BY defines ordering within each group.",
      "ROW_NUMBER, RANK, and DENSE_RANK assign rankings. They differ in how ties are handled.",
      "SUM, AVG, and other aggregates can be used as window functions to calculate running totals and moving averages.",
      "LAG and LEAD access values from previous or next rows, useful for calculating differences between consecutive rows.",
    ],
    examples: [
      { title: "RANK by Department", sql: "SELECT name, department, salary,\n  RANK() OVER (\n    PARTITION BY department\n    ORDER BY salary DESC\n  ) AS dept_rank\nFROM employees;", explanation: "Ranks employees by salary within each department. Ties get the same rank, and the next rank is skipped." },
      { title: "Running Total", sql: "SELECT order_date, customer_name,\n  quantity * price AS value,\n  SUM(quantity * price) OVER (\n    ORDER BY order_date\n  ) AS running_total\nFROM orders;", explanation: "Calculates a running total of order values sorted by date. Each row shows the cumulative sum up to that point." },
    ],
    starterCode: "SELECT name, department, salary,\n  RANK() OVER (\n    PARTITION BY department\n    ORDER BY salary DESC\n  ) AS dept_rank\nFROM employees;",
    prevSlug: "subqueries",
  },
};

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  basics: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  joins: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  aggregations: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  subqueries: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  "window-functions": { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

export default function LabTopicPage() {
  const params = useParams();
  const topicSlug = params.topicSlug as string;
  const lesson = lessonsData[topicSlug];

  const [code, setCode] = useState(lesson?.starterCode ?? "");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [aiExplaining, setAiExplaining] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: code }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch {
      setQueryResult({
        columns: [],
        rows: [],
        executionTimeMs: 0,
        error: "Failed to execute query. Check your connection.",
      });
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-black italic text-slate-700">404</h1>
        <p className="text-slate-500 font-medium tracking-tight">Lesson not found</p>
        <Link href="/lab">
          <Button variant="outline" className="border-slate-800 mt-2">Back to Lab</Button>
        </Link>
      </div>
    );
  }

  const colors = categoryColors[lesson.category] || categoryColors.basics;

  async function handleAskAI() {
    setAiExplaining(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: `Explain the key concepts of "${lesson.title}" in SQL. Keep it concise and beginner-friendly.`,
          context: lesson.content.join(" "),
        }),
      });
      const data = await res.json();
      setAiResponse(data.result || "Failed to get response");
    } catch {
      setAiResponse("Failed to connect to AI. Make sure your API key is configured.");
    } finally {
      setAiExplaining(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-8 md:py-12 px-4 md:px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -right-[10%] w-[25%] h-[25%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/lab">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-1">
            <Badge variant="outline" className={`capitalize text-[10px] ${colors.border} ${colors.text}`}>
              {lesson.category.replace("-", " ")}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{lesson.title}</h1>
          </div>
        </motion.div>

        {/* ═══ Split Pane: Content (left) + Editor (right) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left Panel: Lesson Content ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Lesson text */}
            <Card className="bg-slate-900/30 border-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.content.map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    className="text-sm leading-relaxed text-slate-400"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </CardContent>
            </Card>

            {/* Code examples */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
                <Code2 className="h-4 w-4 text-indigo-500" />
                Examples
              </h2>
              {lesson.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.08 }}
                >
                  <Card className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{example.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px] gap-1 text-slate-500 hover:text-indigo-400"
                          onClick={() => setCode(example.sql)}
                        >
                          <Play className="h-3 w-3" />
                          Try it
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="rounded-xl overflow-hidden border border-slate-800/50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/70 border-b border-slate-800/50">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-rose-500/50" />
                            <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                            <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 ml-2">
                            <Terminal className="h-3 w-3 inline mr-1" />
                            example.sql
                          </span>
                        </div>
                        <pre className="p-4 overflow-x-auto bg-slate-950/50">
                          <code className="text-sm font-mono text-slate-300 leading-relaxed">{example.sql}</code>
                        </pre>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{example.explanation}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Right Panel: SQL Editor + Results ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <Card className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-500" />
                    SQL Editor
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                    Ctrl+Enter to run
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-slate-800/50">
                  <SQLEditor
                    value={code}
                    onChange={setCode}
                    onRun={handleRun}
                    height="260px"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Run button */}
            <Button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 shadow-lg shadow-indigo-500/20"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run Query"}
            </Button>

            {/* Results */}
            <AnimatePresence>
              {queryResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Card className="bg-slate-900/30 border-slate-800/50 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
                          Output
                        </CardTitle>
                        {!queryResult.error && queryResult.rows.length > 0 && (
                          <span className="text-[10px] text-slate-600">
                            {queryResult.rows.length} row{queryResult.rows.length !== 1 ? "s" : ""} &middot; {queryResult.executionTimeMs}ms
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResultsTable result={queryResult} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ═══ Concept Visualizer (full-width bottom section) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/30 border-slate-800/50">
            <CardContent className="p-6">
              <ConceptVisualizer category={lesson.category} />
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══ AI Tutor ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-indigo-500/5 border-indigo-500/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-bold text-sm">AI Tutor</p>
                    <p className="text-xs text-slate-500">Get a personalized explanation of this topic</p>
                  </div>
                  <Button
                    onClick={handleAskAI}
                    disabled={aiExplaining}
                    size="sm"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {aiExplaining ? "Thinking..." : "Explain with AI"}
                  </Button>
                  <AnimatePresence>
                    {aiResponse && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-slate-900/50 border border-slate-800/50 p-4 overflow-hidden"
                      >
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">{aiResponse}</pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══ Navigation ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between pt-4"
        >
          {lesson.prevSlug ? (
            <Link href={`/lab/${lesson.prevSlug}`}>
              <Button variant="outline" className="gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 rounded-xl h-11">
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
            </Link>
          ) : <div />}
          {lesson.nextSlug ? (
            <Link href={`/lab/${lesson.nextSlug}`}>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl h-11 shadow-lg shadow-indigo-500/20">
                Next Lesson <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/arena">
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl h-11 shadow-lg shadow-indigo-500/20">
                Enter the Arena <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
