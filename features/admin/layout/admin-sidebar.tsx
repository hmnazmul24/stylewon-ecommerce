import { SquareDashedBottomCode } from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AdminAccounts } from "@/features/admin/layout/admin-accounts";
import { AdminSidebarMenu } from "@/features/admin/layout/admin-sidebar-menu";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-sm bg-emerald-900">
                  <SquareDashedBottomCode className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xl leading-6 font-bold">
                    Admin Panel
                  </span>
                  <ShowRole />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense>
          <AdminSidebarMenu />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        <AdminAccounts />
      </SidebarFooter>
    </Sidebar>
  );
}

async function ShowRole() {
  return <span className="truncate text-xs leading-tight">Manager</span>;
}
