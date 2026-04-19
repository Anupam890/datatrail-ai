"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2 } from "lucide-react";

interface Lesson {
  title: string;
  slug: string;
  description: string;
  category: string;
  lessonCount: number;
  completedCount: number;
}

const lessons: Lesson[] = [
  { title: "Introduction to SQL", slug: "intro-to-sql", description: "SELECT, WHERE, ORDER BY, and LIMIT fundamentals", category: "basics", lessonCount: 4, completedCount: 4 },
  { title: "Working with JOINs", slug: "working-with-joins", description: "INNER, LEFT, RIGHT, FULL joins and self-joins", category: "joins", lessonCount: 5, completedCount: 3 },
  { title: "Aggregate Functions", slug: "aggregate-functions", description: "COUNT, SUM, AVG, GROUP BY, and HAVING", category: "aggregations", lessonCount: 4, completedCount: 2 },
  { title: "Subqueries", slug: "subqueries", description: "Scalar, correlated, EXISTS, and IN subqueries", category: "subqueries", lessonCount: 4, completedCount: 1 },
  { title: "Window Functions", slug: "window-functions", description: "RANK, ROW_NUMBER, LAG, LEAD, and running totals", category: "window-functions", lessonCount: 5, completedCount: 0 },
];

const categories = [
  { value: "all", label: "All" },
  { value: "basics", label: "Basics" },
  { value: "joins", label: "Joins" },
  { value: "aggregations", label: "Aggregations" },
  { value: "subqueries", label: "Subqueries" },
  { value: "window-functions", label: "Window Functions" },
];

function LessonCard({ lesson }: { lesson: Lesson }) {
  const progress = (lesson.completedCount / lesson.lessonCount) * 100;
  const isComplete = lesson.completedCount === lesson.lessonCount;

  return (
    <Link href={`/lab/${lesson.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="capitalize text-xs">{lesson.category.replace("-", " ")}</Badge>
            </div>
            {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </div>
          <CardTitle className="text-lg mt-2">{lesson.title}</CardTitle>
          <CardDescription>{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{lesson.completedCount}/{lesson.lessonCount} sections</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LabPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">The Lab</h1>
        <p className="text-muted-foreground">Structured SQL tracks and experiments</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </TabsContent>

        {categories.slice(1).map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons
                .filter((l) => l.category === cat.value)
                .map((lesson) => (
                  <LessonCard key={lesson.slug} lesson={lesson} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
