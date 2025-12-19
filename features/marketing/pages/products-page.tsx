import { getQueryClient } from "@/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductsListings from "../components/products/products-listings";
import ProductsNavHeader from "../components/products/products-nav-header";

export default function ProductsPage() {
  const qc = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <div className="min-h-screen">
        <ProductsNavHeader />
        <ProductsListings />
      </div>
    </HydrationBoundary>
  );
}
