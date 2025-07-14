'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
        <TooltipProvider>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-4">
            {badges.map((badge) => (
              <Tooltip key={badge.title}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-2 aspect-square rounded-lg border transition-all",
                      badge.unlocked
                        ? "bg-amber-400/20 border-amber-500/50"
                        : "bg-muted opacity-50 grayscale"
                    )}
                  >
                    <BadgeIcon name={badge.icon} className={cn("w-8 h-8", badge.unlocked ? "text-amber-500" : "text-muted-foreground")} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{badge.title}</p>
                  <p>{badge.description}</p>
                  {!badge.unlocked && <p className="text-xs text-muted-foreground">(Locked)</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
