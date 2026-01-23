"use cache";
import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InventoryHeading from "../components/inventory-heading";
import { InventoryListingTable } from "../components/inventory-listing-table";
import { getInventory } from "../queries";

export default async function InventoryPage() {
  cacheLife("seconds");
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });
  return (
    <div>
      <InventoryHeading />
      <HydrationBoundary state={dehydrate(qc)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <InventoryListingTable />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
