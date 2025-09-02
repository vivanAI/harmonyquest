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
  { rank: 1, name: "Elena Petrova", score: 1450, avatar: "/images/woman-head-silhouette-png-black-and-white-download-female-silhouette-head-11563010560sqe7wt34hg-600x569.webp" },
  { rank: 2, name: "Kenji Tanaka", score: 1420, avatar: "/images/male-silhoutte.png" },
  { rank: 3, name: "You", score: 1415, avatar: "/images/male-silhoutte.png" },
  { rank: 4, name: "Fatima Al-Jamil", score: 1390, avatar: "/images/woman-head-silhouette-png-black-and-white-download-female-silhouette-head-11563010560sqe7wt34hg-600x569.webp" },
  { rank: 5, name: "David Chen", score: 1350, avatar: "/images/male-silhoutte.png" },
]

export default function TriviaPage() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* Weekly Challenge Section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Trivia Challenge</h1>
        <Card className="overflow-hidden">
          <div className="relative h-64 w-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950">
            {/* Religious Symbols Overlay */}
            <div className="absolute inset-0 opacity-20">
              {/* Om Symbol */}
              <div className="absolute top-8 left-12 text-white text-4xl font-bold">ॐ</div>
              
              {/* Buddhist Wheel */}
              <div className="absolute top-6 right-16 text-white text-3xl">☸</div>
              
              {/* Cross */}
              <div className="absolute top-12 left-1/3 text-white text-3xl">✝</div>
              
              {/* Star and Crescent */}
              <div className="absolute top-8 right-1/3 text-white text-3xl">☪</div>
              
              {/* Star of David */}
              <div className="absolute bottom-20 left-1/4 text-white text-2xl">✡</div>
              
              {/* Yin Yang */}
              <div className="absolute bottom-16 right-1/4 text-white text-3xl">☯</div>
              
              {/* Khanda (Sikh Symbol) */}
              <div className="absolute top-1/2 left-8 text-white text-2xl">☬</div>
              
              {/* Lotus */}
              <div className="absolute bottom-12 right-12 text-white text-2xl">🪷</div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl opacity-30">✦</div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-2xl opacity-30">✦</div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6">
              <CardDescription className="text-primary-foreground/80 mb-1">This Week's Theme</CardDescription>
              <h2 className="text-4xl font-extrabold text-white">
                Festivals of Faith
              </h2>
            </div>
          </div>
          <CardContent className="p-6 flex flex-col items-start gap-4">
            <p className="text-muted-foreground max-w-xl">Test your knowledge on the vibrant and colorful festivals of world religions. Are you ready to prove your expertise?</p>
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
                                 <TableRow key={player.rank} className={player.name === 'You' ? 'bg-primary/10' : ''}>
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
