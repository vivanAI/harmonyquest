import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { slugify } from "@/lib/utils"

const learningModules = [
  {
    title: "Festivals of Faith",
    description: "Explore the vibrant celebrations of world religions.",
    progress: 75,
  },
  {
    title: "Core Tenets & Beliefs",
    description: "Understand the fundamental principles of different faiths.",
    progress: 40,
  },
  {
    title: "Sacred Places",
    description: "Virtually visit the most holy sites around the globe.",
    progress: 0,
  },
  {
    title: "Daily Practices",
    description: "Learn about the rituals that shape daily life.",
    progress: 0,
  },
  {
    title: "Respectful Interactions",
    description: "Master the art of culturally sensitive communication.",
    progress: 15,
  },
    {
    title: "Culinary Traditions",
    description: "Discover the stories and tastes behind cultural dishes.",
    progress: 0,
  },
]

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
      </div>
      <p className="text-muted-foreground">
        Duolingo-style modular, interactive lessons with positive feedback.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {learningModules.map((mod) => (
          <Card key={mod.title} className="flex flex-col">
            <CardHeader>
              <CardTitle>{mod.title}</CardTitle>
              <CardDescription>{mod.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Progress value={mod.progress} indicatorClassName="bg-blue-400" aria-label={`${mod.progress}% complete`} />
              <p className="text-sm text-muted-foreground mt-2">{mod.progress}% complete</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                <Link href={`/learn/${slugify(mod.title)}`}>
                  {mod.progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
