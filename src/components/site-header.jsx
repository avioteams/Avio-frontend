import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  IconNotification
} from "@tabler/icons-react"

export function SiteHeader() {
  return (
    <header
      className="pt-2 pb-2 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <input type="search" className="p-6 pt-1 pb-1 border bg-gray-100 rounded-2xl" placeholder="Search anything..." />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex rounded-full">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="text-secondary-foreground bg-secondary">
              <IconNotification />
            </a>
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex rounded-full">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="text-secondary-foreground bg-secondary">
              P
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
