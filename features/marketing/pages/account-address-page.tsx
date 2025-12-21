"use cache: private";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BillingForm } from "../components/checkout/checkout-form";
import { getBillingsInfo } from "../server/billing.actions";

export default async function AccountAddressPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["billings"],
    queryFn: () => getBillingsInfo(),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <BillingForm />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
