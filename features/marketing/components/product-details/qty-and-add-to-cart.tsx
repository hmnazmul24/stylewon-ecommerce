"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useGuestUserCart } from "../../hooks/use-guest-user-cart";

import { productDetails } from "../../server/queries";
import { CartType } from "../../types";
import { useProductSelection } from "../../hooks/use-product-selection";
import { addToCart } from "../../server/cart.action";

export function QtyAndAddToCart({
  product,
}: {
  product: Awaited<ReturnType<typeof productDetails>>;
}) {
  const { isPending, data } = authClient.useSession();

  const { quantity, setQuantity, selectedImage } = useProductSelection();
  // local-cart
  const { guestUserAddItem } = useGuestUserCart();
  const qc = getQueryClient();

  // database-cart
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: async () => {
      toast.success("Added to cart.");
      await qc.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

  return (
    <Fragment>
      <div className="flex items-center gap-4">
        {Number(product.stocks) !== 0 ? (
          <div className="flex items-center gap-1">
            <Button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
              <Minus />
            </Button>
            <Button>{quantity}</Button>
            <Button onClick={() => setQuantity(quantity + 1)}>
              <Plus />
            </Button>
          </div>
        ) : (
          <Badge variant={"destructive"}>Out of stock</Badge>
        )}
        <div className="text-2xl font-bold">
          {Number(product.price)} &#x09F3;
        </div>
      </div>

      <Button
        disabled={addToCartMutation.isPending || Number(product.stocks) === 0}
        onClick={() => {
          if (isPending) {
            return toast.info("Wait a while");
          }

          const info: CartType = {
            name: product.name,
            price: Number(product.price),
            productId: product.id,
            quantity,
            imageUrl: selectedImage,
          };
          if (data) {
            addToCartMutation.mutate(info);
          } else {
            guestUserAddItem(info);
            toast.success("Added to cart.");
          }
        }}
        className="w-full rounded-full py-6"
      >
        Add to Cart
      </Button>
    </Fragment>
  );
}
