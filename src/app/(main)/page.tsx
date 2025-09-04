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
import { Badge } from "@/components/ui/badge"
import { Flame, Star, Sparkles, TrendingUp, Award, BookOpen, Target, Zap } from "lucide-react"
import Link from "next/link"
import { useStatsStore } from "@/lib/stats-store"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

const learningModules = [
  { title: "Festivals of Faith", slug: "festivals-of-faith", icon: BookOpen, difficulty: "Beginner", estimatedTime: "8 min" },
  { title: "Core Tenets & Beliefs", slug: "core-tenets-beliefs", icon: BookOpen, difficulty: "Intermediate", estimatedTime: "10 min" },
  { title: "Sacred Places", slug: "sacred-places", icon: BookOpen, difficulty: "Beginner", estimatedTime: "10 min" },
]

// Calculate rank based on XP
const calculateRank = (xp: number) => {
  if (xp > 1000) return { rank: "#1", title: "Master", color: "bg-gradient-to-r from-yellow-400 to-orange-500" };
  if (xp > 500) return { rank: "#5", title: "Expert", color: "bg-gradient-to-r from-purple-400 to-pink-500" };
  if (xp > 200) return { rank: "#10", title: "Advanced", color: "bg-gradient-to-r from-blue-400 to-cyan-500" };
  return { rank: `#${Math.max(20 - Math.floor(xp / 10), 12)}`, title: "Learner", color: "bg-gradient-to-r from-green-400 to-emerald-500" };
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome back, {session?.backendUser?.name || session?.user?.name || 'User'}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Ready to continue your journey of cultural discovery?
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {streak > 0 ? `${streak} day streak!` : 'Start your streak today!'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">Total Experience</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-3 text-blue-700 dark:text-blue-300">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              {xp}
            </CardTitle>
          </CardHeader>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full -translate-y-16 translate-x-16"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-orange-600 dark:text-orange-400 font-medium">Learning Streak</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-3 text-orange-700 dark:text-orange-300">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              {streak}
            </CardTitle>
          </CardHeader>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 dark:bg-orange-800/20 rounded-full -translate-y-16 translate-x-16"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">Current Rank</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              {userRank.rank}
            </CardTitle>
          </CardHeader>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 dark:bg-purple-800/20 rounded-full -translate-y-16 translate-x-16"></div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-green-600 dark:text-green-400 font-medium">Next Goal</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-3 text-green-700 dark:text-green-300">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              {xp >= 1000 ? 'Master Level!' : `${1000 - xp} XP to go`}
            </CardTitle>
          </CardHeader>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-full -translate-y-16 translate-x-16"></div>
        </Card>
      </div>

      {/* Rank Badge */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${userRank.color}`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">You are a {userRank.title}</h3>
                <p className="text-muted-foreground">Keep learning to unlock new achievements!</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {userRank.rank}
            </Badge>
          </div>
        </CardContent>
      </Card>
      


      {/* Discovery Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Religious Discovery
            </CardTitle>
            <CardDescription className="text-amber-600 dark:text-amber-400">A new fact for you today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-amber-800 dark:text-amber-200">
              Sikhism's Golden Temple in Amritsar, India serves free meals to over 100,000 people daily, regardless of religion, caste, or background, embodying the Sikh principle of "Langar" - selfless service to humanity.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Religious Discovery
            </CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400">A new fact for you today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-indigo-800 dark:text-indigo-200">
              The Baháʼí Faith has a unique calendar of 19 months, each with 19 days, plus an intercalary period. Each month is named after an attribute of God.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            Continue Learning
          </CardTitle>
          <CardDescription className="text-lg">Pick up where you left off and keep building your knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningModules.map((mod) => {
              // Only get progress on client side to avoid hydration mismatch
              const progress = isClient ? getLessonProgress(mod.slug) : 0;
              return (
                <div key={mod.title} className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <mod.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{mod.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {mod.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {mod.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
                    <p className="text-sm text-muted-foreground">
                      {progress === 100 ? 'Lesson completed! 🎉' : `${progress}% complete`}
                    </p>
                  </div>
                  <Button 
                    variant={progress === 100 ? "outline" : "default"} 
                    size="sm" 
                    className="min-w-[120px]"
                    asChild
                  >
                    <Link href="/learn">
                      {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
