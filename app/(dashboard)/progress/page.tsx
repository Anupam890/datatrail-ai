"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const topicBreakdown = [
  { topic: "Basics", solved: 8, total: 10, accuracy: 90 },
  { topic: "Joins", solved: 5, total: 10, accuracy: 72 },
  { topic: "Aggregations", solved: 6, total: 10, accuracy: 80 },
  { topic: "Subqueries", solved: 3, total: 8, accuracy: 60 },
  { topic: "Window Fn", solved: 2, total: 8, accuracy: 45 },
];

const accuracyOverTime = [
  { week: "Week 1", accuracy: 50 },
  { week: "Week 2", accuracy: 58 },
  { week: "Week 3", accuracy: 65 },
  { week: "Week 4", accuracy: 70 },
  { week: "Week 5", accuracy: 72 },
  { week: "Week 6", accuracy: 78 },
];

const submissionHistory = [
  { date: "2024-04-01", problem: "Select All Employees", status: "correct", time: "2m 15s" },
  { date: "2024-04-01", problem: "Filter by Department", status: "correct", time: "1m 48s" },
  { date: "2024-04-02", problem: "Salary Ranking", status: "incorrect", time: "8m 42s" },
  { date: "2024-04-02", problem: "Count by Department", status: "correct", time: "1m 30s" },
  { date: "2024-04-03", problem: "Self Join - Find Managers", status: "correct", time: "5m 10s" },
  { date: "2024-04-03", problem: "Running Total of Orders", status: "incorrect", time: "12m 03s" },
  { date: "2024-04-04", problem: "Employee-Department Join", status: "correct", time: "3m 22s" },
  { date: "2024-04-04", problem: "Above Average Salary", status: "correct", time: "4m 15s" },
];

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-muted-foreground">Your SQL learning analytics and insights</p>
      </div>

      {/* Topic Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="topic" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Solved" />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accuracy Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={accuracyOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weak Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicBreakdown.map((topic) => (
            <div key={topic.topic} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{topic.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{topic.solved}/{topic.total} solved</span>
                  <Badge
                    variant="outline"
                    className={
                      topic.accuracy >= 80
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : topic.accuracy >= 60
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {topic.accuracy}%
                  </Badge>
                </div>
              </div>
              <Progress value={(topic.solved / topic.total) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {submissionHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.status === "correct" ? "bg-green-500" : "bg-red-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{item.problem}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={item.status === "correct" ? "default" : "destructive"} className="text-xs">
                    {item.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
