'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Badge } from "@/lib/badges"
import { cn } from "@/lib/utils"
import { BadgeIcon } from "@/components/badge-icon"

interface BadgeCollectionProps {
  badges: Badge[]
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Collection</CardTitle>
        <CardDescription>Achievements you've unlocked on your journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-all",
                badge.unlocked
                  ? "bg-amber-400/10 border-amber-500/30"
                  : "bg-muted opacity-60 grayscale"
              )}
            >
              <div className={cn(
                  "flex items-center justify-center p-3 rounded-lg",
                  badge.unlocked ? "bg-amber-400/20" : "bg-muted-foreground/20"
                )}>
                <BadgeIcon 
                  name={badge.icon} 
                  className={cn(
                    "w-8 h-8", 
                    badge.unlocked ? "text-amber-500" : "text-muted-foreground"
                  )} 
                />
              </div>
              <div className="flex flex-col">
                <p className={cn("font-bold", badge.unlocked ? "text-foreground" : "text-muted-foreground")}>
                  {badge.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
                {!badge.unlocked && <p className="text-xs text-muted-foreground mt-1">(Locked)</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
