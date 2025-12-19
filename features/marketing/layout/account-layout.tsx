"use client";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { cn } from "@/lib/utils";
import { Home, Layout, List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigateHeading } from "../components/shared/heading";

const data = [
  { title: "Dashboard", url: "/account/dashboard", icon: Layout },
  { title: "Profile", url: "/account/profile", icon: User },
  {
    title: "Orders",
    url: "/account/orders",
    icon: List,
  },
  {
    title: "Address",
    url: "/account/address",
    icon: Home,
  },
];

export default function AccountLayout(props: LayoutProps<"/account">) {
  const pathname = usePathname().split("?")[0];
  const isAccountMainPage = pathname === "/account";

  return (
    <div className="m-auto min-h-dvh max-w-5xl p-4 md:flex md:items-start">
      <Navigator pathname={pathname} />

      <div className="w-full">
        <NavigateHeading
          className={cn("mb-4 md:hidden", isAccountMainPage && "hidden")}
          link="/account"
        >
          {data.find((d) => d.url === pathname)?.title}
        </NavigateHeading>
        <div className="md:p-6 md:pt-14">{props.children}</div>
      </div>
    </div>
  );
}

function Navigator({ pathname }: { pathname: string }) {
  const isAccountMainPage = pathname === "/account";
  return (
    <div
      className={cn(
        "w-full md:w-[200px]",
        !isAccountMainPage && "hidden md:block",
      )}
    >
      <NavigateHeading className="mb-4 md:pb-1" link="/">
        Account
      </NavigateHeading>
      <div className="rounded-sm border">
        {data.map((item, i) => (
          <Link key={item.url} href={item.url}>
            <div
              className={cn(
                "hover:bg-accent/50 flex items-center justify-start gap-2 rounded-none p-4",
                pathname === item.url && "bg-accent",
                i + 1 !== data.length && "border-b",
              )}
            >
              <item.icon size={20} /> {item.title}
            </div>
          </Link>
        ))}
      </div>
      <SignOutButton />
    </div>
  );
}
