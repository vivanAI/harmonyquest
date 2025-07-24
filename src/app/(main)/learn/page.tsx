"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LearnPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/lessons")
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(() => setLessons([]));
  }, []);
  console.log("Lessons loaded from backend:", lessons);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
      </div>
      <p className="text-muted-foreground">
        Duolingo-style modular, interactive lessons with positive feedback.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(lessons) && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                {/* Optionally add a description if available from backend */}
              </CardHeader>
              <CardContent className="flex-grow">
                <Progress value={0} indicatorClassName="bg-green-400" aria-label={`0% complete`} />
                <p className="text-sm text-muted-foreground mt-2">0% complete</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                  <Link href={`/learn/${lesson.slug}`}>
                    Start Lesson
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No lessons found.</p>
        )}
      </div>
    </div>
  )
}
