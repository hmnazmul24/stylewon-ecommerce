"use client";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getMarketingProducts } from "../../server/queries";
import { ProductCard, ProductCardsSkeleton } from "../shared/product-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function HomeProductListing() {
  return (
    <div className="m-auto max-w-5xl px-2 md:mt-4 xl:px-0">
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<ProductCardsSkeleton />}>
          <Products />
        </Suspense>
      </ErrorBoundary>
      <Link href={"/products"}>
        <Button className="mt-2 w-full" variant={"secondary"}>
          View all products <ChevronRight />
        </Button>
      </Link>
    </div>
  );
}

function Products() {
  const { data } = useSuspenseQuery({
    queryKey: ["marketing-products"],
    queryFn: () => getMarketingProducts(),
  });

  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-4">
      {data.map(({ product: p }) => (
        <ProductCard
          stocks={p.stocks}
          key={p.id}
          name={p.name}
          price={p.price}
          images={p.images}
          id={p.id}
        />
      ))}
    </div>
  );
}
