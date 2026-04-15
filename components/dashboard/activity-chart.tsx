"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", submissions: 4, correct: 3 },
  { day: "Tue", submissions: 6, correct: 5 },
  { day: "Wed", submissions: 3, correct: 2 },
  { day: "Thu", submissions: 8, correct: 7 },
  { day: "Fri", submissions: 5, correct: 4 },
  { day: "Sat", submissions: 10, correct: 8 },
  { day: "Sun", submissions: 7, correct: 6 },
];

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="submissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="correct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#submissions)"
              name="Submissions"
            />
            <Area
              type="monotone"
              dataKey="correct"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#correct)"
              name="Correct"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
