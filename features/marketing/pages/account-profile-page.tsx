"use cache: private";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getUserInfo } from "@/features/auth/actions";
import { CompletedProfileBox } from "@/features/auth/components/profile/completed-profile-box";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function AccountProfilePage() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfo(),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <CompletedProfileBox />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
