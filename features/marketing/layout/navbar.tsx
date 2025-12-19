"use client";

import { authClient } from "@/lib/auth-client";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";
import { CartSaveDbIfExistDilaog } from "../components/cart/cart-save-db-if-exist-dialog";
import { Suspense } from "react";
export default function Navbar() {
  const { data, isPending } = authClient.useSession();
  return (
    <div className="sticky top-0 right-0 z-50 border-b border-dashed bg-emerald-800/80 backdrop-blur-md">
      <div className="m-auto flex h-20 max-w-7xl items-center px-2 xl:px-0">
        <div className="w-full md:hidden">
          <NavbarMobile user={data?.user} isPending={isPending} />
        </div>
        <div className="hidden w-full md:block">
          <NavbarDesktop user={data?.user} isPending={isPending} />
        </div>
      </div>
      <Suspense>
        <CartSaveDbIfExistDilaog />
      </Suspense>
    </div>
  );
}
