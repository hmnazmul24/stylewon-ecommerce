"use cache";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProductHeading from "../components/product-heading";
import ProductListingTable from "../components/product-listing-table";
import { getProducts } from "../queries";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";

export default async function ProductsPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  return (
    <div>
      <ProductHeading />
      <HydrationBoundary state={dehydrate(qc)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <ProductListingTable />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
