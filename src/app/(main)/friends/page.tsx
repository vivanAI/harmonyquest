'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Search, UserPlus, Swords } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const friends = [
  { name: "Elena Petrova", username: "@elena", avatar: "/images/woman-head-silhouette-png-black-and-white-download-female-silhouette-head-11563010560sqe7wt34hg-600x569.webp" },
  { name: "Kenji Tanaka", username: "@kenji", avatar: "/images/male-silhoutte.png" },
  { name: "Fatima Al-Jamil", username: "@fatima", avatar: "/images/woman-head-silhouette-png-black-and-white-download-female-silhouette-head-11563010560sqe7wt34hg-600x569.webp" },
  { name: "David Chen", username: "@dave", avatar: "/images/male-silhoutte.png" },
]

export default function FriendsPage() {

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
    </div>
  )
}
