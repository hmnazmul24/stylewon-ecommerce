"use cache: private";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProfileSections } from "./profile-sections";
import { getUserInfo } from "../../actions";

export async function CompletedProfileBox() {
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfo(),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <ProfileSections />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
