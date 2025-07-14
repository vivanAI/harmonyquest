import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Award, Medal, Zap } from "lucide-react"

const leaderboard = [
  { rank: 1, name: "Elena Petrova", score: 1450, avatar: "https://placehold.co/100x100" },
  { rank: 2, name: "Kenji Tanaka", score: 1420, avatar: "https://placehold.co/100x100" },
  { rank: 3, name: "Vivan Sharma", score: 1415, avatar: "https://placehold.co/100x100" },
  { rank: 4, name: "Fatima Al-Jamil", score: 1390, avatar: "https://placehold.co/100x100" },
  { rank: 5, name: "David Chen", score: 1350, avatar: "https://placehold.co/100x100" },
]

export default function TriviaPage() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* Weekly Challenge Section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Trivia Challenge</h1>
        <Card className="overflow-hidden">
          <div className="relative h-64 w-full">
            <Image
              src="https://placehold.co/1200x400"
              alt="Weekly trivia theme"
              data-ai-hint="Japanese festival"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <CardDescription className="text-primary-foreground/80 mb-1">This Week's Theme</CardDescription>
              <h2 className="text-4xl font-extrabold text-white">
                Japanese Festivals
              </h2>
            </div>
          </div>
          <CardContent className="p-6 flex flex-col items-start gap-4">
            <p className="text-muted-foreground max-w-xl">Test your knowledge on the vibrant and colorful festivals of Japan. Are you ready to prove your expertise?</p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Your Rank</span>
                        <span className="font-bold text-base">#3</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Medal className="w-5 h-5 text-slate-400" />
                     <div className="flex flex-col">
                        <span className="text-muted-foreground">Your Title</span>
                        <span className="font-semibold text-base">Cultural Ambassador</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Zap className="w-5 h-5 text-orange-500" />
                     <div className="flex flex-col">
                        <span className="text-muted-foreground">Streak Bonus</span>
                        <span className="font-bold text-base">+50 pts</span>
                    </div>
                </div>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              <Zap className="mr-2 h-5 w-5"/>
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Leaderboard</CardTitle>
          <CardDescription>See how you stack up against the competition.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((player, index) => (
                <TableRow key={player.rank} className={player.name === 'Vivan Sharma' ? 'bg-primary/10' : ''}>
                  <TableCell className="font-bold text-lg text-center">
                    {index === 0 ? <Crown className="w-6 h-6 text-yellow-400 mx-auto" /> : player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-lg">{player.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}