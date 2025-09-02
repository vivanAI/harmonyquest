
'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Swords, Users, Library, Bot, Settings, LifeBuoy, TrendingUp } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home, badge: null },
  { href: "/learn", label: "Learn", icon: BookOpen, badge: "New" },
  { href: "/trivia", label: "Trivia", icon: Swords, badge: null },
  { href: "/friends", label: "Friends", icon: Users, badge: "3" },
  { href: "/library", label: "Library", icon: Library, badge: null },
  { href: "/ai-guide", label: "AI Guide", icon: Bot, badge: null },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <path d="M5.13 5.13C5.55 4.71 6.2 4.5 7 4.5h2.3c.3 0 .6.1.8.4l5.6 5.6c.2.2.3.5.3.8V14a2 2 0 0 1-2 2h-1.5a2 2 0 0 0-2 2v1.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2.3c0-.3.1-.6.4-.8l5.6-5.6c.2-.2.5-.3.8-.3H14a2 2 0 0 0 2-2v-1.5a2 2 0 0 1 2-2H19c.8 0 1.5.21 1.97.63"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Harmony Quest</span>
            <span className="text-xs text-muted-foreground">Cultural Learning</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={item.label}
                className="relative group"
              >
                <Link href={item.href} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "New" ? "secondary" : "outline"}
                      className="text-xs px-2 py-0.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-3 space-y-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support" className="group">
              <div className="p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <span className="font-medium">Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="group">
              <div className="p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <Separator className="my-3" />
        
        {/* User Profile Section */}
        <Link 
          href={isAuthenticated ? "/profile" : "/auth"} 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarImage 
                src={user?.avatar || "https://placehold.co/100x100"} 
                alt={user?.name || "User"} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate text-sm">
              {user?.name || "Sign In"}
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "Click to login or register"}
              </p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
