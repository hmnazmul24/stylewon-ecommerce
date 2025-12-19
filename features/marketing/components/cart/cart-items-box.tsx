"use client";
import { Button } from "@/components/ui/button";
import { SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { CartType } from "../../types";
import { CartItem } from "./cart-item";
import { CartEmptyBox } from "./cart-empty-box";
import { useRouter } from "next/navigation";
import { useGuestUserCart } from "../../hooks/use-guest-user-cart";
import { CompletedAuthBox } from "@/features/auth/components/completed-auth-box";
export function CartItemsBox({
  carts,
  type,
  onClose,
}: {
  type: "local" | "db";
  carts: CartType[];
  onClose: () => void;
}) {
  const [shouldAuthBoxOpen, setShouldAuthBoxOpen] = useState(false);
  const router = useRouter();
  // total amount
  const total =
    carts.length === 0
      ? 0
      : carts.reduce((prev, curr) => prev + curr.price * curr.quantity, 0);

  return shouldAuthBoxOpen ? (
    <Fragment>
      <SheetHeader className="hidden">
        <SheetTitle className="text-destructive text-2xl"></SheetTitle>
      </SheetHeader>
      <AuthBox onClose={onClose} />
    </Fragment>
  ) : (
    <Fragment>
      <SheetHeader>
        <SheetTitle className="text-2xl">Shopping Carts</SheetTitle>
      </SheetHeader>
      <div className="space-y-1 p-5">
        {carts.length === 0 ? (
          <CartEmptyBox />
        ) : (
          carts.map((item) => (
            <CartItem type={type} key={item.productId} item={item} />
          ))
        )}
      </div>
      <SheetFooter className="flex flex-row items-center justify-between">
        <div className="rounded-full py-6 text-lg md:text-2xl">
          Total : {total} &#x09F3;
        </div>
        <Button
          onClick={() => {
            if (type === "local") {
              setShouldAuthBoxOpen(true);
            } else {
              if (total !== 0) {
                router.push("/checkout");
              }
              onClose();
            }
          }}
          className="w-32 rounded-full py-4 md:py-6"
        >
          Proceed <ChevronRight />
        </Button>
      </SheetFooter>
    </Fragment>
  );
}

function AuthBox({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const { guestUserCartItems } = useGuestUserCart();
  return (
    <div className="p-4 lg:p-6">
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>
      <CompletedAuthBox
        onClose={() => {
          if (guestUserCartItems.length !== 0) {
            setTimeout(() => {
              router.push(`?local-cart-count=${guestUserCartItems.length}`);
            }, 500);
          }
          onClose();
        }}
      />
    </div>
  );
}
