'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Sparkles } from "lucide-react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useStatsStore } from "@/lib/stats-store"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

const learningModules = [
  { title: "Festivals of Faith", slug: "festivals-of-faith", icon: "BookOpen" as const },
  { title: "Core Tenets & Beliefs", slug: "core-tenets-beliefs", icon: "BookOpen" as const },
  { title: "Sacred Places", slug: "sacred-places", icon: "BookOpen" as const },
]

// Calculate rank based on XP
const calculateRank = (xp: number) => {
  if (xp > 1000) return "#1";
  if (xp > 500) return "#5";
  if (xp > 200) return "#10";
  return `#${Math.max(20 - Math.floor(xp / 10), 12)}`; // Simple rank logic
}

export default function DashboardPage() {
  const { xp, streak, resetStats, getLessonProgress } = useStatsStore();
  const { data: session } = useSession();
  const loadedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Load progress from backend once when session has backendToken
    if (!loadedRef.current && session?.backendToken && session?.backendUser?.id) {
      loadedRef.current = true;
      useStatsStore.getState().loadUserProgress(session.backendUser.id, session.backendToken).catch((e) => {
        console.error('Failed to load progress from backend:', e);
      });
    }
  }, [session?.backendToken, session?.backendUser?.id]);
  const userRank = calculateRank(xp);
  
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.backendUser?.name || session?.user?.name || 'User'}!
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Points</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" /> {xp} XP
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" /> {streak} days
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rank</CardDescription>
            <CardTitle className="text-3xl">{userRank}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Temporary Reset Button - Remove after testing */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={resetStats}
          className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
        >
          Reset Stats (Testing)
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Racial Discovery
            </CardTitle>
            <CardDescription>A new fact for you</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg">In South Africa, the term 'Coloured' refers to a multiracial ethnic group, with a unique heritage blending African, European, and Asian ancestry.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Religious Discovery
            </CardTitle>
            <CardDescription>A new fact for you</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg">The Baháʼí Faith has a unique calendar of 19 months, each with 19 days, plus an intercalary period. Each month is named after an attribute of God.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {learningModules.map((mod) => {
                // Only get progress on client side to avoid hydration mismatch
                const progress = isClient ? getLessonProgress(mod.slug) : 0;
                return (
                  <div key={mod.title} className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-md">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="grid gap-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {mod.title}
                      </p>
                      <Progress value={progress} aria-label={`${progress}% complete`} indicatorClassName="bg-green-400" />
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/learn">{progress > 0 ? 'Continue' : 'Start'}</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
