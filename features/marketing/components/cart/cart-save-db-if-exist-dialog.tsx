"use client";

import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGuestUserCart } from "../../hooks/use-guest-user-cart";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { addToCart } from "../../server/cart.action";
import { toast } from "sonner";
export function CartSaveDbIfExistDilaog() {
  const router = useRouter();
  const pathname = usePathname().split("?")[0];
  const param = useSearchParams().get("local-cart-count");
  const [open, setOpen] = useState(false);
  const { guestUserClearCart, guestUserCartItems } = useGuestUserCart();
  const qc = getQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const cartsPromise = guestUserCartItems.map((v) => addToCart(v));
      await Promise.all(cartsPromise);
    },
    onSuccess: async () => {
      guestUserClearCart();
      await qc.invalidateQueries({ queryKey: ["user-cart"] });
      toast.success("Saved");
      router.push(pathname);
      setOpen(false);
    },
  });
  useEffect(() => {
    if (param) {
      setOpen(true);
    }
  }, [param]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hidden">{null}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You have {guestUserCartItems.length} unsaved cart.
          </AlertDialogTitle>
          <AlertDialogDescription>
            if you want to save them so click to save or discard them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              guestUserClearCart();
              router.push(pathname);
            }}
          >
            Discard
          </AlertDialogCancel>
          <ButtonWithLoading
            isPending={isPending}
            type="button"
            onClick={() => mutate()}
          >
            Save
          </ButtonWithLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
