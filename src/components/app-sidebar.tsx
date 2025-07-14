
'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Swords, Users, Library, Bot, Settings, LifeBuoy } from "lucide-react"

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

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/trivia", label: "Trivia", icon: Swords },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/library", label: "Library", icon: Library },
  { href: "/ai-guide", label: "AI Guide", icon: Bot },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><path d="M5.13 5.13C5.55 4.71 6.2 4.5 7 4.5h2.3c.3 0 .6.1.8.4l5.6 5.6c.2.2.3.5.3.8V14a2 2 0 0 1-2 2h-1.5a2 2 0 0 0-2 2v1.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2.3c0-.3.1-.6.4-.8l5.6-5.6c.2-.2.5-.3.8-.3H14a2 2 0 0 0 2-2v-1.5a2 2 0 0 1 2-2H19c.8 0 1.5.21 1.97.63"/></svg>
            </div>
            <span className="font-semibold text-lg">Harmony Quest</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <LifeBuoy />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-2" />
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors">
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100" alt="Vivan" />
                <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold truncate">Vivan Sharma</p>
                <p className="text-xs text-muted-foreground truncate">vivan.sharma@example.com</p>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
