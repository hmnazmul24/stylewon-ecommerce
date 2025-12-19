"use client";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompletedAuthBox } from "@/features/auth/components/completed-auth-box";
import { useIsMobile } from "@/hooks/use-mobile";
import { User as UserType } from "better-auth";
import {
  ContainerIcon,
  ListChecks,
  Loader2,
  Menu,
  Search,
  ShoppingCartIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartWrapper } from "../components/cart/cart-wrapper";
import { useGuestUserCart } from "../hooks/use-guest-user-cart";
import { useRouter } from "next/navigation";
import { CategoryCheckBox } from "../components/shared/category-checkbox";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../server/queries";

type UserSession = {
  isPending: boolean;
  user: UserType | undefined;
};
type DrawarComponnentType = "CATEGORY" | "USER" | "SEARCH";
export function NavbarMobile(session: UserSession) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] =
    useState<DrawarComponnentType>("CATEGORY");

  const { guestUserCartItems } = useGuestUserCart();

  const categoryQuery = useQuery({
    queryKey: ["marketing-categories", "categories"],
    queryFn: () => getCategories(),
  });
  return (
    <div className="flex items-center justify-between">
      <section>
        <Logo />
      </section>
      <section className="flex items-center gap-1 md:hidden">
        <Link href={"/products"}>
          <Button>
            <Search />
          </Button>
        </Link>
        <CartWrapper>
          <Button>
            Cart <ShoppingCartIcon />
          </Button>
        </CartWrapper>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={"/products"}>
              <DropdownMenuItem>
                <ContainerIcon />
                Products
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => {
                setOpenDrawer(true);
                setSelectedDrawerType("CATEGORY");
              }}
            >
              <ListChecks /> Categories
            </DropdownMenuItem>
            <Link href={"/products"}>
              <DropdownMenuItem>
                <Search /> Search
              </DropdownMenuItem>
            </Link>
            {session.isPending ? (
              <DropdownMenuItem>
                <Loader2 className="animate-spin" />
              </DropdownMenuItem>
            ) : session.user ? (
              <Link href={isMobile ? "/account" : "/account/dashboard"}>
                <DropdownMenuItem>
                  <User /> Accounts
                </DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  setOpenDrawer(true);
                  setSelectedDrawerType("USER");
                }}
              >
                <User /> Sign in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>{null}</DrawerTrigger>
        <DrawerContent className="min-h-2/3 rounded-none!">
          <DrawerHeader className="hidden">
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {selectedDrawerType === "CATEGORY" ? (
              <div>
                {categoryQuery.data && (
                  <CategoryCheckBox data={categoryQuery.data} />
                )}
              </div>
            ) : selectedDrawerType == "SEARCH" ? (
              <div>search</div>
            ) : (
              <CompletedAuthBox
                onClose={() => {
                  if (guestUserCartItems.length !== 0) {
                    setTimeout(() => {
                      router.push(
                        `?local-cart-count=${guestUserCartItems.length}`,
                      );
                    }, 500);
                    setOpenDrawer(false);
                  }
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
