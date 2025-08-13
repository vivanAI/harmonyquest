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
import { useStatsStore } from "@/lib/stats-store"
import { getBackendBase } from "@/lib/utils"

export default function LearnPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const { xp, streak, updateLessonProgress, getLessonProgress } = useStatsStore();
  
  // Simple local state for progress tracking
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  
  // Load progress from store on component mount and sync with store changes
  useEffect(() => {
    // Initialize lesson progress from store
    const progress: Record<string, number> = {};
    lessons.forEach(lesson => {
      const storeProgress = getLessonProgress(lesson.slug);
      if (storeProgress > 0) {
        progress[lesson.slug] = storeProgress;
      }
    });
    
    setLessonProgress(progress);
    
    // Count lessons with any progress
    const completedCount = Object.values(progress).filter((p: any) => p > 0).length;
    setLessonsCompleted(completedCount);
  }, [lessons, getLessonProgress]);
  
  // Sync local state when store changes
  useEffect(() => {
    const unsubscribe = useStatsStore.subscribe((state) => {
      // Update local state when store changes
      const progress: Record<string, number> = {};
      lessons.forEach(lesson => {
        const storeProgress = state.getLessonProgress(lesson.slug);
        if (storeProgress > 0) {
          progress[lesson.slug] = storeProgress;
        }
      });
      
      setLessonProgress(progress);
      
      const completedCount = Object.values(progress).filter((p: any) => p > 0).length;
      setLessonsCompleted(completedCount);
    });
    
    return unsubscribe;
  }, [lessons]);
  
  useEffect(() => {
    const BASE = getBackendBase()
    fetch(`${BASE}/lessons`)
      .then(res => {
        console.log('GET /lessons status', res.status)
        return res.json()
      })
      .then((data) => {
        console.log('GET /lessons payload', data)
        setLessons(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('GET /lessons failed', err)
        setLessons([])
      })
  }, []);
  
  // Calculate overall progress
  const overallProgress = lessons.length > 0 
    ? Math.round(Object.values(lessonProgress).reduce((sum: number, progress: number) => sum + progress, 0) / lessons.length)
    : 0;
  
  console.log('Progress state:', { lessonProgress, lessonsCompleted, overallProgress });
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        <button
          onClick={() => {
            // Reset both store and local state
            useStatsStore.getState().resetStats();
            setLessonProgress({});
            setLessonsCompleted(0);
          }}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          title="Reset progress data"
        >
          Reset Progress
        </button>
      </div>
      <p className="text-muted-foreground">
        Duolingo-style modular, interactive lessons with positive feedback.
      </p>
      
      {/* Overall Progress Summary */}
      <div className="grid gap-4 md:grid-cols-3 p-4 border rounded bg-card">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{lessonsCompleted}</div>
          <div className="text-sm text-muted-foreground">Lessons Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{xp}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{overallProgress}%</div>
          <div className="text-sm text-muted-foreground">Overall Progress</div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(lessons) && lessons.length > 0 ? (
          lessons.map((lesson) => {
            const progress = lessonProgress[lesson.slug] || 0;
            const hasParts = lesson.content?.parts && Array.isArray(lesson.content.parts);
            const totalParts = hasParts ? lesson.content.parts.length : 1;
            
            // Calculate completed parts for display
            let completedParts = 0;
            if (hasParts && totalParts > 1) {
              completedParts = Math.round((progress / 100) * totalParts);
            }
            
            let statusText = 'Not Started';
            if (progress === 100) {
              statusText = 'Completed';
            } else if (progress > 0) {
              statusText = `${completedParts}/${totalParts} parts completed`;
            }
            
            return (
              <Card key={lesson.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  {hasParts && totalParts > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {totalParts} parts • {completedParts} completed
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <Progress value={progress} indicatorClassName="bg-green-400" aria-label={`${progress}% complete`} />
                  <p className="text-sm text-muted-foreground mt-2">
                    {statusText}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                    <Link href={`/learn/${lesson.slug}`}>
                      {progress === 100 ? 'Review Lesson' : 'Continue Lesson'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p>No lessons found.</p>
        )}
      </div>
    </div>
  )
}
