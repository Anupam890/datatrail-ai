"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Code2 } from "lucide-react";
import { useState } from "react";

const lessonsData: Record<string, {
  title: string;
  category: string;
  content: string[];
  examples: { title: string; sql: string; explanation: string }[];
  prevSlug?: string;
  nextSlug?: string;
}> = {
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
    prevSlug: "working-with-joins",
    nextSlug: "subqueries",
  },
  "subqueries": {
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
    prevSlug: "subqueries",
  },
};

export default function LabTopicPage() {
  const params = useParams();
  const topicSlug = params.topicSlug as string;
  const lesson = lessonsData[topicSlug];
  const [aiExplaining, setAiExplaining] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Lesson not found</p>
        <Link href="/lab">
          <Button className="mt-4">Back to Lab</Button>
        </Link>
      </div>
    );
  }

  async function handleAskAI() {
    setAiExplaining(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: `Explain the key concepts of "${lesson.title}" in SQL. Keep it concise.`,
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/lab">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <Badge variant="outline" className="capitalize mb-1">{lesson.category.replace("-", " ")}</Badge>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>
      </div>

      {/* Content Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lesson.content.map((paragraph, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
          ))}
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {lesson.examples.map((example, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="mb-6" />}
              <h3 className="font-semibold text-sm mb-2">{example.title}</h3>
              <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                <code className="text-sm font-mono">{example.sql}</code>
              </pre>
              <p className="text-sm text-muted-foreground mt-2">{example.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ask AI */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Ask AI</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAskAI} disabled={aiExplaining} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {aiExplaining ? "Thinking..." : "Explain this concept with AI"}
          </Button>
          {aiResponse && (
            <div className="mt-4 rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        {lesson.prevSlug ? (
          <Link href={`/lab/${lesson.prevSlug}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Previous Lesson
            </Button>
          </Link>
        ) : <div />}
        {lesson.nextSlug ? (
          <Link href={`/lab/${lesson.nextSlug}`}>
            <Button className="gap-2">
              Next Lesson <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/arena">
            <Button className="gap-2">
              Enter the Arena <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
