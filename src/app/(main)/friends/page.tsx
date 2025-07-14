'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Swords } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCollection } from "@/components/badge-collection"
import { useStatsStore } from "@/lib/stats-store"

const friends = [
  { name: "Elena Petrova", username: "@elena", avatar: "https://placehold.co/100x100" },
  { name: "Kenji Tanaka", username: "@kenji", avatar: "https://placehold.co/100x100" },
  { name: "Fatima Al-Jamil", username: "@fatima", avatar: "https://placehold.co/100x100" },
  { name: "David Chen", username: "@dave", avatar: "https://placehold.co/100x100" },
]

export default function FriendsPage() {
  const { badges } = useStatsStore()
  const userBadges = Object.values(badges);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Friend
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search friends by username..." className="pl-8" />
      </div>
      <Tabs defaultValue="friends">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
        </TabsList>
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Your Friends</CardTitle>
              <CardDescription>
                Challenge your friends to a friendly quiz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.map((friend) => (
                  <div key={friend.username} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">{friend.username}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Swords className="mr-2 h-4 w-4" />
                      Challenge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="milestones">
          <BadgeCollection badges={userBadges} />
        </TabsContent>
        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Friends Trivia Rankings</CardTitle>
              <CardDescription>
                See how you stack up against your friends this week.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No active challenges.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
