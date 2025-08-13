import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { ProgressLoader } from "@/components/progress-loader"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ProgressLoader />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
