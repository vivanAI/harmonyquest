'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useStatsStore } from "@/lib/stats-store"
import { Star, Flame } from "lucide-react"

export function Header() {
  const { xp, streak } = useStatsStore()
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      
      {/* Stats Display */}
      <div className="hidden sm:flex items-center gap-4 mr-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-950/20 rounded-full">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{xp} XP</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/20 rounded-full">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{streak} days</span>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100" alt="Avatar" />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
