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
import { Star, Flame, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function Header() {
  const [isClient, setIsClient] = useState(false)
  const { xp, streak, _forceUpdate } = useStatsStore()
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Don't render any dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <SidebarTrigger className="sm:hidden" />
        
        <div className="flex-1" />
        
        {/* Placeholder for stats */}
        <div className="hidden sm:flex items-center gap-3 mr-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-full border border-yellow-200/50 dark:border-yellow-800/30">
            <div className="p-1 bg-yellow-500 rounded-full">
              <Star className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">0 XP</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            <div className="p-1 bg-orange-500 rounded-full">
              <Flame className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">0 days</span>
          </div>
        </div>
        
        {/* Simple user button without dropdown */}
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-auto gap-2 px-3 rounded-full hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/100x100" alt="Avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">V</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium">Victor</span>
            <span className="text-xs text-muted-foreground">User</span>
          </div>
        </Button>
      </header>
    )
  }
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      
      <div className="flex-1" />
      
      {/* Stats Display */}
      {isClient && (
        <div className="hidden sm:flex items-center gap-3 mr-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-full border border-yellow-200/50 dark:border-yellow-800/30">
            <div className="p-1 bg-yellow-500 rounded-full">
              <Star className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            <div className="p-1 bg-orange-500 rounded-full">
              <Flame className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{streak} days</span>
          </div>
        </div>
      )}


      
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-auto gap-2 px-3 rounded-full hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/100x100" alt="Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">V</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-medium">Victor</span>
              <span className="text-xs text-muted-foreground">User</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Victor</p>
              <p className="text-xs leading-none text-muted-foreground">victor@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">Help Center</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
