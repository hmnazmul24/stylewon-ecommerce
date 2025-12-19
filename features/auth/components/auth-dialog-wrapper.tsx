"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { CompletedAuthBox } from "./completed-auth-box";
import { useGuestUserCart } from "@/features/marketing/hooks/use-guest-user-cart";
import { useRouter } from "next/navigation";

export function AuthDialogWrapper({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { guestUserCartItems } = useGuestUserCart();
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md border px-10">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <CompletedAuthBox
          onClose={() => {
            if (guestUserCartItems.length !== 0) {
              setTimeout(() => {
                router.push(`?local-cart-count=${guestUserCartItems.length}`);
              }, 500);
            }
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
