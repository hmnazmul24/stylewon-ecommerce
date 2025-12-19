import { AdminSidebar } from "@/features/admin/layout/admin-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "./admin-header";
import { Suspense } from "react";

export default function AdminLayout(props: LayoutProps<"/admin">) {
  return (
    <SidebarProvider className="">
      <AdminSidebar />
      <SidebarInset className="noise-background">
        <Suspense>
          <AdminHeader />
        </Suspense>
        <div className="p-4 md:px-10">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
