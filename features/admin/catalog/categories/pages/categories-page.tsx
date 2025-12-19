"use cache: private";
import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CategoriesListing } from "../components/categories-listing";
import { getCategoreis } from "../queries";

export default async function CategoriesPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoreis(),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(qc)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <CategoriesListing />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
