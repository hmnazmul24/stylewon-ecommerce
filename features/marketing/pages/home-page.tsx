"use cache: private";

import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { HeroCarousel } from "../components/home/hero-carousel";
import { HomeProductListing } from "../components/home/home-product-listing";
import { getCategories, getMarketingProducts } from "../server/queries";

export default async function HomePage() {
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
