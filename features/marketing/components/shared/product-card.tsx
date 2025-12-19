"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  name: string;
  price: string;
  images: string[];
  id: string;
  stocks: string | null;
};

export function ProductCard({
  name,
  price,
  images,
  id,
  stocks,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <div className="flex flex-col overflow-hidden rounded-sm border bg-emerald-800/80 transition">
        <Image
          src={images[0] ?? ""}
          alt={name}
          height={200}
          width={2000}
          className="h-48 w-full object-cover md:h-52"
        />

        <div className="relative flex flex-col space-y-1 p-2">
          <span className="truncate text-xs font-medium md:text-sm">
            {name}
          </span>
          <span className="text-sm font-semibold md:text-base">
            {price} taka
          </span>
          {Number(stocks) === 0 && (
            <Badge
              variant={"outline"}
              className="text-destructive absolute right-2 bottom-3"
            >
              Out of stock
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
export function ProductCardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-2 md:grid-cols-4 md:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-sm border"
        >
          <Skeleton className="h-48 w-full object-cover md:h-52" />
          <div className="relative flex flex-col gap-2 space-y-1 p-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
