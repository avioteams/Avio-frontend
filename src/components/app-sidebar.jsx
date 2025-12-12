import { NavLink } from "react-router-dom"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Home,
  Sparkles,
  PiggyBank,
  Wallet,
  ShieldCheck,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: Home,
    },
    {
      to: "/chat",
      title: "Create Automation",
      icon: Sparkles,
    },
    // {
    //   to: "/dashboard/savings",
    //   title: "Save some Money",
    //   icon: PiggyBank,
    // },
    // {
    //   to: "/dashboard/wallet",
    //   title: "Fund Wallet",
    //   icon: Wallet,
    // },
    {
      to: "/dashboard/escrow",
      title: "Escrow",
      icon: ShieldCheck,
    },
  ],

  navSecondary: [
    {
      to: "/dashboard/settings",
      title: "Settings",
      icon: Settings,
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