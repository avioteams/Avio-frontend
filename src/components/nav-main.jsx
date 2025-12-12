import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={
                      `py-6 px-6 font-semibold mb-2 ${isActive
                        ? "bg-[#e30101] text-white hover:bg-[#c00000] hover:text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}