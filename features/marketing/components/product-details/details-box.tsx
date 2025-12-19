"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { useProductSelection } from "../../hooks/use-product-selection";
import { productDetails } from "../../server/queries";
import AdditionalInfo from "./additional-info";
import { QtyAndAddToCart } from "./qty-and-add-to-cart";
import { Skeleton } from "@/components/ui/skeleton";

export function DetailsBox({ id }: { id: string }) {
  const {
    selectedImage,
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedImage,
    setSelectedSize,
    setQuantity,
  } = useProductSelection();

  const { data: product } = useSuspenseQuery({
    queryKey: ["marketing-product-details", id],
    queryFn: () => productDetails(id),
  });
  const item = product; // since productDetails returns an array
  useEffect(() => {
    setSelectedImage(product.images[0]);
    return () => {
      (setSelectedColor(""), setSelectedSize(""), setQuantity(1));
    };
  }, []);

  if (!item) return <div>No product found.</div>;

  return (
    <section className="mx-auto max-w-5xl px-2 py-2 lg:px-0 lg:py-10 xl:px-0">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left: Image gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="bg-muted aspect-square w-full overflow-hidden rounded-xl border">
            <Image
              src={selectedImage || product.images[0]}
              alt={item.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-row gap-1 overflow-x-auto">
            {item.images?.map((img) => (
              <div
                key={img}
                onClick={() => setSelectedImage(img)}
                className="aspect-square w-20 flex-none overflow-hidden rounded-lg border transition hover:opacity-80"
              >
                <Image
                  src={img}
                  alt="thumb"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold">{item.name}</h1>
          </div>
          <FieldGroup>
            {item.sizes.length !== 0 && (
              <Field>
                <FieldLabel>Sizes</FieldLabel>
                <FieldContent className="flex-row flex-wrap">
                  {item.sizes.map((size) => (
                    <Button
                      onClick={() => setSelectedSize(size.label)}
                      className="flex-none"
                      variant={
                        selectedSize === size.label ? "default" : "outline"
                      }
                      key={size.id}
                    >
                      {size.label}
                    </Button>
                  ))}
                </FieldContent>
              </Field>
            )}
            {item.colors.length !== 0 && (
              <Field>
                <FieldLabel>Colors</FieldLabel>
                <FieldContent className="flex-row flex-wrap">
                  {item.colors.map((color) => (
                    <Button
                      onClick={() => setSelectedColor(color.label)}
                      variant={
                        selectedColor === color.label ? "default" : "outline"
                      }
                      className="flex-none"
                      key={color.id}
                    >
                      <span
                        style={{ background: `${color.hexColor ?? ""}` }}
                        className={cn("inline-block size-3 rounded-full")}
                      ></span>
                      {color.label}
                    </Button>
                  ))}
                </FieldContent>
              </Field>
            )}
          </FieldGroup>

          <QtyAndAddToCart product={product} />
        </div>
      </div>
      <AdditionalInfo des={product.description || ""} />
    </section>
  );
}

export function DetailsBoxSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT: Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <Skeleton className="aspect-square w-full rounded-xl" />

          {/* Thumbnails */}
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-16 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <Skeleton className="h-8 w-2/3 rounded-md" />

          {/* Sizes */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Quantity + Price */}
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            <Skeleton className="h-6 w-20 rounded-md" />
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
