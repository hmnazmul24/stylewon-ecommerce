import { Heading } from "@/features/marketing/components/shared/heading";
import { getOrders } from "../queries";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import OrdersTable from "../components/orders-table";

export default async function OrdersPage() {
  const promise = getOrders();
  return (
    <div>
      <Heading className="text-start">Orders</Heading>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading</div>}>
          <OrdersTable promise={promise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
