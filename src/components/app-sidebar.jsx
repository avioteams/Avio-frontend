import { NavLink } from "react-router-dom"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: IconDashboard,
    },
    {
      to: "/chat",
      title: "Create Automation",
      icon: IconListDetails,
    },
    {
      to: "/dashboard/savings",
      title: "Save some Money",
      icon: IconChartBar,
    },
    {
      to: "/dashboard/wallet",
      title: "Fund Wallet",
      icon: IconFolder,
    },
    {
      to: "/dashboard/escrow",
      title: "Escrow",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      to: "/dashboard/settings",
      title: "Settings",
      icon: IconSettings
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/dashboard">
              <img src="/Logo.svg" alt="Logo" className="w-26" />
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  )
}