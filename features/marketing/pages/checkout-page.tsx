"use cache: private";

import { Suspense } from "react";
import { BillingForm } from "../components/checkout/checkout-form";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import Loading from "@/components/shared/loading";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/components/shared/error";
import { getBillingsInfo } from "../server/billing.actions";

export default async function CheckoutPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["billings"],
    queryFn: () => getBillingsInfo(),
  });
  return (
    <div className="m-auto min-h-screen max-w-5xl p-4">
      <HydrationBoundary state={dehydrate(qc)}>
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <BillingForm />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
}
