"use cache: private";

import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { HeroCarousel } from "../components/home/hero-carousel";
import { HomeProductListing } from "../components/home/home-product-listing";
import { getMarketingProducts } from "../server/queries";
import { cacheLife } from "next/cache";

export default async function HomePage() {
  cacheLife("seconds");
  const qc = getQueryClient();
  void qc.prefetchQuery({
    queryKey: ["marketing-products"],
    queryFn: () => getMarketingProducts(),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(qc)}>
        <HeroCarousel />
        <HomeProductListing />
      </HydrationBoundary>
    </main>
  );
}
