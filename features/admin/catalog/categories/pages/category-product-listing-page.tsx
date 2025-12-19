import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CaetegoryProdutListing } from "../components/category-product-listing";
import { singleCategroyWithProducts } from "../queries";

export default function CategoryProductListingPage({
  categoryId,
}: {
  categoryId: string;
}) {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: [categoryId],
    queryFn: () => singleCategroyWithProducts({ categoryId }),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <CaetegoryProdutListing categoryId={categoryId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
