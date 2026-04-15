"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Flame, Clock } from "lucide-react";

const stats = [
  { title: "Problems Solved", value: "24", icon: Trophy, change: "+3 this week", color: "text-green-500" },
  { title: "Accuracy", value: "78%", icon: Target, change: "+5% improvement", color: "text-blue-500" },
  { title: "Current Streak", value: "7 days", icon: Flame, change: "Best: 12 days", color: "text-orange-500" },
  { title: "Time Spent", value: "18h", icon: Clock, change: "This month", color: "text-purple-500" },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
