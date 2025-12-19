"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSidebarNavItems } from "./utils";

export function AdminSidebarMenu() {
  const pathname = usePathname();
  const selectedRoute = (url: string) => {
    const originalUrl = url.split("?")[0];
    if (pathname.startsWith(originalUrl)) {
      return true;
    } else {
      return false;
    }
  };
  return adminSidebarNavItems.map(
    (item) =>
      !item.hide && (
        <SidebarGroup key={item.title} className="py-0">
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarMenu className="">
            {item.lists.map((list) => (
              <SidebarMenuItem key={list.url}>
                <Link href={list.url}>
                  <SidebarMenuButton
                    className={cn(
                      "rounded-full px-2 py-5",
                      selectedRoute(list.url) && "bg-sidebar-accent",
                    )}
                  >
                    <list.icon />
                    <span>{list.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ),
  );
}
