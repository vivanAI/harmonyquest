import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Crown } from "lucide-react"

const leaderboard = [
  { rank: 1, name: "Elena Petrova", score: 1450, avatar: "https://placehold.co/100x100" },
  { rank: 2, name: "Kenji Tanaka", score: 1420, avatar: "https://placehold.co/100x100" },
  { rank: 3, name: "Vivan Sharma", score: 1415, avatar: "https://placehold.co/100x100" },
  { rank: 4, name: "Fatima Al-Jamil", score: 1390, avatar: "https://placehold.co/100x100" },
  { rank: 5, name: "David Chen", score: 1350, avatar: "https://placehold.co/100x100" },
]

export default function TriviaPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-8">
        <Card className="relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <Image
            src="https://placehold.co/800x400"
            alt="Weekly trivia theme"
            data-ai-hint="Japanese festival"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <CardHeader className="relative z-10">
            <CardDescription className="text-primary-foreground/80">This Week's Challenge</CardDescription>
            <CardTitle className="text-4xl font-extrabold text-white">
              Japanese Festivals
            </CardTitle>
          </CardHeader>
          <CardFooter className="relative z-10">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Start Challenge</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Trivia Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-3xl font-bold">#3</p>
            </div>
            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Your Title</p>
              <p className="text-3xl font-bold text-center">Cultural Ambassador</p>
            </div>
            <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Streak Bonus</p>
              <p className="text-3xl font-bold">+50 pts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Leaderboard</CardTitle>
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
                    <TableCell className="font-medium text-center">
                      {index === 0 ? <Crown className="w-5 h-5 text-yellow-400" /> : player.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{player.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
