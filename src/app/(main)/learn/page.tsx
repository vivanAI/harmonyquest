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
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useStatsStore } from "@/lib/stats-store"
import { getBackendBase } from "@/lib/utils"
import { BookOpen, Clock, Target, Trophy, Star, TrendingUp, Play, CheckCircle } from "lucide-react"

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Learning Journey
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Duolingo-style modular, interactive lessons with positive feedback and progress tracking.
            </p>
          </div>
          <Button
            onClick={() => {
              // Reset both store and local state
              useStatsStore.getState().resetStats();
              setLessonProgress({});
              setLessonsCompleted(0);
            }}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            title="Reset progress data"
          >
            Reset Progress
          </Button>
        </div>
      </div>
      
      {/* Progress Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{lessonsCompleted}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lessons Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{xp}</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Total XP Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{overallProgress}%</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      {lessonsCompleted > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    Great Progress! 🎉
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400">
                    You've completed {lessonsCompleted} lesson{lessonsCompleted !== 1 ? 's' : ''} and earned {xp} XP!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Keep it up!
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Lessons Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Available Lessons</h2>
          <Badge variant="outline" className="px-3 py-1">
            {lessons.length} lessons available
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              let statusColor = 'text-muted-foreground';
              if (progress === 100) {
                statusText = 'Completed! 🎉';
                statusColor = 'text-green-600 dark:text-green-400';
              } else if (progress > 0) {
                statusText = `${completedParts}/${totalParts} parts completed`;
                statusColor = 'text-blue-600 dark:text-blue-400';
              }
              
              return (
                <Card key={lesson.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {lesson.title}
                        </CardTitle>
                        {hasParts && totalParts > 1 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {totalParts} parts • {completedParts} completed
                            </span>
                          </div>
                        )}
                      </div>
                      {progress === 100 && (
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <Progress 
                        value={progress} 
                        className="h-2" 
                        indicatorClassName="bg-gradient-to-r from-primary to-accent" 
                        aria-label={`${progress}% complete`} 
                      />
                      <p className={`text-sm font-medium ${statusColor}`}>
                        {statusText}
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      className={`w-full ${
                        progress === 100 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : progress > 0 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                      asChild
                    >
                      <Link href={`/learn/${lesson.slug}`} className="flex items-center gap-2">
                        {progress === 100 ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Review Lesson
                          </>
                        ) : progress > 0 ? (
                          <>
                            <Play className="w-4 h-4" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Start Lesson
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="p-6 bg-muted/50 rounded-lg">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No lessons available</h3>
                <p className="text-muted-foreground">Check back later for new learning content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
