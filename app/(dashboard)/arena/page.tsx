"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle2, Circle, Bookmark } from "lucide-react";

interface Problem {
  id: number;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  solved: boolean;
  bookmarked: boolean;
}

const problems: Problem[] = [
  { id: 1, slug: "select-all-employees", title: "Select All Employees", difficulty: "easy", topic: "basics", solved: true, bookmarked: false },
  { id: 2, slug: "filter-by-department", title: "Filter by Department", difficulty: "easy", topic: "basics", solved: true, bookmarked: false },
  { id: 3, slug: "count-by-department", title: "Count by Department", difficulty: "easy", topic: "aggregations", solved: true, bookmarked: false },
  { id: 4, slug: "average-salary-by-department", title: "Average Salary by Department", difficulty: "easy", topic: "aggregations", solved: false, bookmarked: true },
  { id: 5, slug: "employee-department-join", title: "Employee-Department Join", difficulty: "medium", topic: "joins", solved: false, bookmarked: false },
  { id: 6, slug: "top-customers-by-orders", title: "Top Customers by Orders", difficulty: "medium", topic: "aggregations", solved: false, bookmarked: false },
  { id: 7, slug: "self-join-find-managers", title: "Self Join - Find Managers", difficulty: "medium", topic: "joins", solved: true, bookmarked: false },
  { id: 8, slug: "orders-with-no-matches", title: "Orders with No Matches", difficulty: "medium", topic: "joins", solved: false, bookmarked: true },
  { id: 9, slug: "salary-ranking", title: "Salary Ranking", difficulty: "hard", topic: "window-functions", solved: false, bookmarked: false },
  { id: 10, slug: "running-total-of-orders", title: "Running Total of Orders", difficulty: "hard", topic: "window-functions", solved: false, bookmarked: false },
  { id: 11, slug: "subquery-above-average-salary", title: "Subquery - Above Average Salary", difficulty: "medium", topic: "subqueries", solved: false, bookmarked: false },
  { id: 12, slug: "correlated-subquery-department-max", title: "Correlated Subquery - Department Max", difficulty: "hard", topic: "subqueries", solved: false, bookmarked: false },
  { id: 13, slug: "monthly-order-summary", title: "Monthly Order Summary", difficulty: "medium", topic: "aggregations", solved: false, bookmarked: false },
  { id: 14, slug: "employees-hired-after-average", title: "Employees Hired After Average", difficulty: "medium", topic: "subqueries", solved: false, bookmarked: false },
  { id: 15, slug: "dense-rank-with-ties", title: "Dense Rank with Ties", difficulty: "hard", topic: "window-functions", solved: false, bookmarked: false },
];

const difficultyColor = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function ArenaPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficulty === "all" || p.difficulty === difficulty;
    const matchTopic = topic === "all" || p.topic === topic;
    return matchSearch && matchDifficulty && matchTopic;
  });

  const solvedCount = problems.filter((p) => p.solved).length;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arena</h1>
          <p className="text-muted-foreground">
            {solvedCount}/{problems.length} solved
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={topic} onValueChange={(v) => setTopic(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="basics">Basics</SelectItem>
            <SelectItem value="joins">Joins</SelectItem>
            <SelectItem value="aggregations">Aggregations</SelectItem>
            <SelectItem value="subqueries">Subqueries</SelectItem>
            <SelectItem value="window-functions">Window Functions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problem List */}
      <div className="space-y-2">
        {filtered.map((problem) => (
          <Link key={problem.id} href={`/arena/${problem.slug}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer mb-2">
              <CardContent className="flex items-center gap-4 p-4">
                {problem.solved ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{problem.id}.</span>
                    <span className="text-sm font-medium">{problem.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {problem.bookmarked && <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  <Badge variant="outline" className="text-xs capitalize">{problem.topic.replace("-", " ")}</Badge>
                  <Badge
                    variant="outline"
                    className={`capitalize ${difficultyColor[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No problems match your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
