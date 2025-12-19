"use cache: private";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { ExistedBillingInfo } from "../components/payment/existed-billing-info";
import { ShippingInfo } from "../components/payment/shipping-info";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  getBillingsInfo,
  getDeliveryPrices,
  getOrderSummery,
} from "../server/billing.actions";
import OrderSummery from "../components/payment/order-summery";

export default async function CheckoutPaymentPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["billings"],
    queryFn: () => getBillingsInfo(),
  });
  void qc.prefetchQuery({
    queryKey: ["delivery_prices"],
    queryFn: () => getDeliveryPrices(),
  });
  void qc.prefetchQuery({
    queryKey: ["order_summery"],
    queryFn: () => getOrderSummery(),
  });

  return (
    <div className="m-auto min-h-screen max-w-5xl p-2">
      <Card className="mt-2 rounded-md">
        <CardHeader>
          <CardTitle>Shipping Info</CardTitle>
        </CardHeader>
        <CardContent>
          <HydrationBoundary state={dehydrate(qc)}>
            <FieldGroup className="gap-8 md:flex-row">
              <FieldGroup>
                <Field>
                  <ErrorBoundary fallback={<Error />}>
                    <Suspense fallback={<Loading />}>
                      <ExistedBillingInfo />
                    </Suspense>
                  </ErrorBoundary>
                </Field>
                <Field>
                  <ErrorBoundary fallback={<Error />}>
                    <Suspense fallback={<Loading />}>
                      <OrderSummery />
                    </Suspense>
                  </ErrorBoundary>
                </Field>
              </FieldGroup>
              <Field>
                <ErrorBoundary fallback={<Error />}>
                  <Suspense fallback={<Loading />}>
                    <ShippingInfo />
                  </Suspense>
                </ErrorBoundary>
              </Field>
            </FieldGroup>
          </HydrationBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
