"use client";

import Loading from "@/components/shared/loading";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Fragment, ReactNode, useState } from "react";
import { useGuestUserCart } from "../../hooks/use-guest-user-cart";

import { getCartItems } from "../../server/cart.action";
import { CartItemsBox } from "./cart-items-box";
export function CartWrapper({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // user
  const session = authClient.useSession();
  // local-storage-cart
  const { guestUserCartItems } = useGuestUserCart();

  //db carts
  const { data, isPending: isDbCartPending } = useQuery({
    queryKey: ["user-cart"],
    queryFn: async () => getCartItems({ userId: session?.data?.user.id }),
    enabled: !!session.data,
  });
  const dbCart = data ?? [];

  // count
  const cartCount = (): number | null => {
    let count = 0;
    if (session) {
      count = dbCart.length;
    }
    if (!session.isPending && !session.data) {
      count = guestUserCartItems.length;
    }
    if (count === 0) {
      return null;
    }
    return count;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="relative">
          {children}
          <span className="text-destructive absolute -top-1.5 right-2 block p-1 font-serif text-sm">
            {cartCount()}
          </span>
        </span>
      </SheetTrigger>
      <SheetContent className="w-4/5 gap-0 overflow-y-auto md:w-md">
        {session.isPending ? (
          <Loading />
        ) : session.data ? (
          <Fragment>
            {isDbCartPending ? (
              <Loading />
            ) : (
              <CartItemsBox
                onClose={() => setOpen(false)}
                carts={dbCart}
                type="db"
              />
            )}
          </Fragment>
        ) : (
          <CartItemsBox
            onClose={() => setOpen(false)}
            carts={guestUserCartItems}
            type="local"
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
