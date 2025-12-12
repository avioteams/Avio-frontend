import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({ items, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={`
                      h-11 px-4 py-3.5 rounded-lg font-medium transition-all duration-200 bg-[#121212]
                      ${
                        isActive
                          ? "bg-[#e30101] text-white hover:bg-[#c00000] hover:text-white shadow-sm"
                          : "text-white hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white'}`} />
                    <span className="ml-3">{item.title}</span>
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