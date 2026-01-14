import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useGuestUserCart } from "../../hooks/use-guest-user-cart";
import { cartActions, isQuantityExist } from "../../server/cart.action";
import { CartType } from "../../types";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { toast } from "sonner";

export function CartItem({
  item,
  type,
}: {
  item: CartType;
  type: "db" | "local";
}) {
  const { guestUserUpdateItemQty, guestUserRemoveItem } = useGuestUserCart();
  const qc = getQueryClient();
  // mutation
  const [pendingType, setPendingType] = useState<
    "INCREASE_QUANTITY" | "REMOVE_FROM_CART" | "DECREASE_QUANTITY" | null
  >(null);
  const { mutate, isPending } = useMutation({
    mutationFn: cartActions,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });
  // actions for checking, is there any stocks avilable
  const existCheckMutation = useMutation({
    mutationFn: isQuantityExist,
    onSuccess: ({ existMore, message }) => {
      if (existMore) {
        guestUserUpdateItemQty(item.productId, item.quantity + 1);
      }
      if (!existMore) {
        toast.info(message);
      }
    },
  });

  // utilities
  const cartAddQty = () => {
    if (type === "local") {
      existCheckMutation.mutate({
        productId: item.productId,
        quantity: item.quantity + 1,
      });
    }
    if (type === "db") {
      if (item.id) {
        setPendingType("INCREASE_QUANTITY");
        mutate({
          type: "INCREASE_QUANTITY",
          cartId: item.id,
          productId: item.productId,
        });
      }
    }
  };

  // =====> differ <=======
  const cartRemoveQty = () => {
    if (type === "local") {
      guestUserUpdateItemQty(
        item.productId,
        item.quantity > 1 ? item.quantity - 1 : 1,
      );
    }
    if (item.id) {
      setPendingType("DECREASE_QUANTITY");
      mutate({
        type: "DECREASE_QUANTITY",
        cartId: item.id,
        productId: item.productId,
      });
    }
  };
  const cartDelete = () => {
    if (type === "local") {
      guestUserRemoveItem(item.productId);
    }
    if (item.id) {
      setPendingType("REMOVE_FROM_CART");
      mutate({
        type: "REMOVE_FROM_CART",
        cartId: item.id,
        productId: item.productId,
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="relative rounded-xl border p-4 shadow-sm">
        <div className="space-y-3">
          <h3 className="truncate font-medium">{item.name}</h3>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-sm">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  className="size-10 object-cover"
                  height={50}
                  width={50}
                  alt="order"
                />
              )}
            </div>
            <p className="text-base font-semibold">
              {item.price * item.quantity} &#x09F3;
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="my-2 flex items-center gap-0.5">
            <Button
              disabled={isPending && pendingType === "DECREASE_QUANTITY"}
              variant={"outline"}
              onClick={cartRemoveQty}
            >
              <Minus />
            </Button>
            <Button variant={"outline"}>{item.quantity}</Button>
            <Button
              disabled={
                existCheckMutation.isPending ||
                (isPending && pendingType === "INCREASE_QUANTITY")
              }
              variant={"outline"}
              onClick={cartAddQty}
            >
              <Plus />
            </Button>
          </div>
          <Button
            disabled={isPending && pendingType === "REMOVE_FROM_CART"}
            variant={"outline"}
            onClick={cartDelete}
            className="rounded-full text-sm text-red-500"
          >
            remove
          </Button>
        </div>
      </div>
    </div>
  );
}
