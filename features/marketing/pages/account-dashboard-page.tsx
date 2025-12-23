"use cache: private";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserDashboard } from "../components/account-dashboard/user-dashboard";
import { getDashboardData } from "../server/account.order";

export default async function AccountDashboardPage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["account_dashboard_info"],
    queryFn: () => getDashboardData(),
  });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <UserDashboard />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
