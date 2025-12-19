"use client";

import Loading from "@/components/shared/loading";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { getCategories, productsWithSearches } from "../../server/queries";
import { ProductCard, ProductCardsSkeleton } from "../shared/product-card";
import { getQueryClient } from "@/tanstack-query/get-query-client";

const categoryParser = parseAsArrayOf(parseAsString).withDefault([]);

export default function ProductsListings() {
  const qc = getQueryClient();
  const [search] = useQueryState("search");
  const [category] = useQueryState("category", categoryParser);
  const debouncedSearch = useDebounce(search ?? "", 300);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["products-with-searches", debouncedSearch, ...category],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await productsWithSearches({
        page: pageParam,
        search: debouncedSearch,
        category: category,
      });
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="m-auto max-w-5xl">
      <div ref={scrollContainerRef} className="space-y-2 overflow-y-auto">
        {isFetching && !data ? (
          <ProductCardsSkeleton />
        ) : error ? (
          <div>Error loading products</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1 px-2 md:grid-cols-4 md:gap-4 md:px-0">
              {data?.pages.map((page) =>
                page.products.map((p) => (
                  <ProductCard
                    stocks={p.stocks}
                    key={p.id}
                    name={p.name}
                    price={p.price}
                    images={p.images}
                    id={p.id}
                  />
                )),
              )}
            </div>
          </>
        )}
      </div>

      {/* ✅ LOAD MORE TRIGGER */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && (
          <p className="text-muted-foreground text-sm">No more products</p>
        )}
      </div>
    </section>
  );
}
