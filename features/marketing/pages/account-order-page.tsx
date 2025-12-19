"use cache: private";

import { getQueryClient } from "@/tanstack-query/get-query-client";
import { OrderListing } from "../components/account-order/order-listing";
import { getOrders } from "../server/account.order";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/components/shared/error";
import { Suspense } from "react";
import Loading from "@/components/shared/loading";

export default async function AccountOrdersPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["order-listings"],
    queryFn: () => getOrders(),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <OrderListing />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
