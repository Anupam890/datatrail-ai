"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentActivity, RecommendedProblems } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, Trophy } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your SQL learning progress</p>
        </div>
        <div className="flex gap-2">
          <Link href="/playground">
            <Button variant="outline" size="sm" className="gap-2">
              <Code2 className="h-4 w-4" /> Playground
            </Button>
          </Link>
          <Link href="/challenges">
            <Button size="sm" className="gap-2">
              <Trophy className="h-4 w-4" /> Challenges
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart />
        <RecentActivity />
      </div>

      <RecommendedProblems />
    </div>
  );
}
