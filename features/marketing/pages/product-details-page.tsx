import Error from "@/components/shared/error";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  DetailsBox,
  DetailsBoxSkeleton,
} from "../components/product-details/details-box";
import { RelatedProducts } from "../components/product-details/related-products";
import { productDetails } from "../server/queries";

export default async function ProductDetailsPage({ slug }: { slug: string }) {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["marketing-product-details", slug],
    queryFn: () => productDetails(slug),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(qc)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<DetailsBoxSkeleton />}>
            <DetailsBox id={slug} />
          </Suspense>
        </ErrorBoundary>
        <RelatedProducts productId={slug} />
      </HydrationBoundary>
    </div>
  );
}
