"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../../server/queries";
import { Heading } from "../shared/heading";
import { ProductCard } from "../shared/product-card";

export function RelatedProducts({ productId }: { productId: string }) {
  const { data } = useQuery({
    queryKey: ["related-products", productId],
    queryFn: () => getRelatedProducts(productId),
  });

  return (
    <div className="m-auto max-w-5xl">
      <Heading>Related products</Heading>
      <div className="grid grid-cols-2 gap-1 px-2 md:grid-cols-3 lg:grid-cols-4 lg:px-0">
        {data?.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
