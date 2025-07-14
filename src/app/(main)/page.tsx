import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Trophy, Sparkles } from "lucide-react"
import Link from "next/link"
import { BadgeIcon } from "@/components/badge-icon"

const learningModules = [
  { title: "Festivals of Faith", progress: 75, icon: "BookOpen" },
  { title: "Core Tenets & Beliefs", progress: 40, icon: "BookOpen" },
  { title: "Sacred Places", progress: 0, icon: "BookOpen" },
]

// Mock user progress data based on the new system
const userProgress = {
  xp: 145,
  streak: 4,
  unlockedBadges: new Set<string>(["Streak Starter", "First Flame"]),
}

// Calculate rank based on XP
const calculateRank = (xp: number) => {
  if (xp > 1000) return "#1";
  if (xp > 500) return "#5";
  if (xp > 200) return "#10";
  return `#${Math.max(20 - Math.floor(xp / 10), 12)}`; // Simple rank logic
}

export default function DashboardPage() {
  const userRank = calculateRank(userProgress.xp);
  
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Vivan!
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Points</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" /> {userProgress.xp} XP
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" /> {userProgress.streak} days
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Badges</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-300" /> {userProgress.unlockedBadges.size}
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
              {learningModules.map((mod) => (
                <div key={mod.title} className="flex items-center gap-4">
                  <BadgeIcon name={mod.icon as any} className="w-4 h-4 text-muted-foreground" />
                  <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {mod.title}
                    </p>
                    <Progress value={mod.progress} aria-label={`${mod.progress}% complete`} indicatorClassName="bg-accent" />
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/learn">{mod.progress > 0 ? 'Continue' : 'Start'}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
