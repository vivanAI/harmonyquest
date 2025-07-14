import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Star, Trophy, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"

const learningModules = [
  { title: "Festivals of Faith", progress: 75, icon: <BookOpen className="w-4 h-4 text-muted-foreground" /> },
  { title: "Core Tenets & Beliefs", progress: 40, icon: <BookOpen className="w-4 h-4 text-muted-foreground" /> },
  { title: "Sacred Places", progress: 0, icon: <BookOpen className="w-4 h-4 text-muted-foreground" /> },
]

export default function DashboardPage() {
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
            <CardTitle className="text-4xl flex items-center gap-2">
              <Star className="w-8 h-8 text-yellow-400" /> 1,250
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Streak</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-500" /> 12 days
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Badges</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <Trophy className="w-8 h-8 text-amber-300" /> 5
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rank</CardDescription>
            <CardTitle className="text-4xl">#12</CardTitle>
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
                  {mod.icon}
                  <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {mod.title}
                    </p>
                    <Progress value={mod.progress} aria-label={`${mod.progress}% complete`} />
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
