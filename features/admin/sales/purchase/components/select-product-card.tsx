"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { isQuantityAvailable } from "../actions";
import { getAdminProducts } from "../product.actions";
import { ProductDynamicInfoType } from "./select-products";

type SelectProductType = {
  productDynamicInfo: ProductDynamicInfoType;
  setProductDynamicInfo: (
    productId: string,
    info: ProductDynamicInfoType,
  ) => void;
  product: Awaited<ReturnType<typeof getAdminProducts>>[number];
  remove: (productId: string) => void;
};
export function SelectProductCard({
  product,
  productDynamicInfo,
  remove,
  setProductDynamicInfo,
}: SelectProductType) {
  const { mutate, isPending } = useMutation({
    mutationFn: isQuantityAvailable,
    onSuccess: (available) => {
      if (available) {
        const newValue: ProductDynamicInfoType = {
          ...productDynamicInfo,
          qty: productDynamicInfo.qty + 1,
          price: productDynamicInfo.price + Number(product.price),
        };
        setProductDynamicInfo(product.id, newValue);
      }
    },
  });

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="relative rounded-xl border p-4 shadow-sm">
        <div className="space-y-3">
          <h3 className="truncate font-medium">{product.name}</h3>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-sm">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  className="size-10 object-cover"
                  height={50}
                  width={50}
                  alt="order"
                />
              )}
            </div>
            <p className="text-base font-semibold">
              {productDynamicInfo.price} &#x09F3;
            </p>
          </div>
        </div>
        <div>
          <h1 className="my-4 font-semibold">Select Size & Color</h1>
          <div className="mb-5 flex items-center gap-2.5">
            {product.sizes && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sizes" />
                </SelectTrigger>
                <SelectContent className="w-full!">
                  {product.sizes.map((s) => (
                    <SelectItem key={s.id} value={s.value}>
                      {s.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {product.colors && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Colors" />
                </SelectTrigger>
                <SelectContent className="">
                  {product.colors.map((c) => (
                    <SelectItem key={c.id} value={c.value}>
                      {c.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="my-2 flex items-center gap-0.5">
            <Button
              variant={"outline"}
              onClick={() => {
                const newValue: ProductDynamicInfoType = {
                  ...productDynamicInfo,
                  qty:
                    productDynamicInfo.qty > 1 ? productDynamicInfo.qty - 1 : 1,
                  price:
                    productDynamicInfo.qty > 1
                      ? productDynamicInfo.price - Number(product.price)
                      : Number(product.price),
                };
                setProductDynamicInfo(product.id, newValue);
              }}
            >
              <Minus />
            </Button>
            <Button variant={"outline"}>{productDynamicInfo.qty}</Button>
            <Button
              disabled={isPending}
              variant={"outline"}
              onClick={() => {
                mutate({
                  productId: product.id,
                  qty: productDynamicInfo.qty + 1,
                });
              }}
            >
              <Plus />
            </Button>
          </div>
          <Button
            variant={"outline"}
            onClick={() => product.id && remove(product.id)}
            className="rounded-full text-sm text-red-500"
          >
            remove
          </Button>
        </div>
      </div>
    </div>
  );
}
