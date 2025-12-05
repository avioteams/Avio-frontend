// src/components/Layout.jsx
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1 p-6 grid gap-6 mt-5">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}