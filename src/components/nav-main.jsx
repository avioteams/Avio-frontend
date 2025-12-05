import { NavLink } from "react-router-dom"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavMain({ items }) {
  return (
    <div>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink 
              to={item.to}
              className={({ isActive }) => isActive ? "bg-primary" : "", "py-6 px-3"}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  )
}