"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useStatsStore } from "@/lib/stats-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Flame, Trophy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const calculateRank = (xp: number) => {
  if (xp > 1000) return "#1";
  if (xp > 500) return "#5";
  if (xp > 200) return "#10";
  return `#${Math.max(20 - Math.floor(xp / 10), 12)}`;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { xp, streak, completedLessons, resetStats } = useStatsStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect to auth page
  }

  const userRank = calculateRank(xp);

  const handleLogout = () => {
    logout();
    resetStats(); // Clear user progress when logging out
    router.push("/auth");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || "https://placehold.co/100x100"} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-lg">{user.email}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Rank {userRank}
                  </Badge>
                  <Badge variant="outline">
                    Learning Enthusiast
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total XP</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                {xp}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Streak</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                {streak} days
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Lessons Completed</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-500" />
                {completedLessons.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your completed lessons and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {completedLessons.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Completed Lessons</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {completedLessons.map((lessonSlug) => (
                      <div key={lessonSlug} className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          {lessonSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Achievements</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {xp >= 50 && (
                      <Badge variant="secondary" className="justify-start">
                        🌟 First Steps - Earned 50+ XP
                      </Badge>
                    )}
                    {streak >= 3 && (
                      <Badge variant="secondary" className="justify-start">
                        🔥 Streak Master - 3+ day streak
                      </Badge>
                    )}
                    {completedLessons.length >= 1 && (
                      <Badge variant="secondary" className="justify-start">
                        📚 Scholar - Completed first lesson
                      </Badge>
                    )}
                    {completedLessons.length >= 3 && (
                      <Badge variant="secondary" className="justify-start">
                        🎓 Dedicated Learner - Completed 3+ lessons
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't completed any lessons yet. Start your learning journey!
                </p>
                <Button onClick={() => router.push("/learn")}>
                  Start Learning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
