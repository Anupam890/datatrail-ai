"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";

const recentActivity = [
  { id: 1, problem: "Select All Employees", status: "correct", time: "2m 15s", topic: "basics", date: "2 hours ago" },
  { id: 2, problem: "Salary Ranking", status: "incorrect", time: "8m 42s", topic: "window-functions", date: "3 hours ago" },
  { id: 3, problem: "Count by Department", status: "correct", time: "1m 30s", topic: "aggregations", date: "5 hours ago" },
  { id: 4, problem: "Self Join - Find Managers", status: "correct", time: "5m 10s", topic: "joins", date: "1 day ago" },
  { id: 5, problem: "Running Total of Orders", status: "incorrect", time: "12m 03s", topic: "window-functions", date: "1 day ago" },
];

const recommendedProblems = [
  { id: 1, title: "Employee-Department Join", difficulty: "medium", topic: "joins" },
  { id: 2, title: "Dense Rank with Ties", difficulty: "hard", topic: "window-functions" },
  { id: 3, title: "Above Average Salary", difficulty: "medium", topic: "subqueries" },
];

const difficultyColor = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <Link href="/progress">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors">
              {item.status === "correct" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.problem}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.topic}</Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{item.time}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{item.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendedProblems() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedProblems.map((problem) => (
            <Link
              key={problem.id}
              href={`/challenges/${problem.id}`}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{problem.title}</p>
                <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">{problem.topic}</Badge>
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${difficultyColor[problem.difficulty as keyof typeof difficultyColor]}`}
              >
                {problem.difficulty}
              </Badge>
            </Link>
          ))}
        </div>
        <Link href="/challenges">
          <Button variant="outline" className="w-full mt-4 gap-2" size="sm">
            Browse All Challenges <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
