"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { searchAnyProducts } from "../actions";

export function SelectProductSearchDialog({
  children,
  setProductIds,
  productIds,
}: {
  children: ReactNode;
  productIds: string[];
  setProductIds: (p: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

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
    queryKey: ["category-products", debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      searchAnyProducts({
        page: pageParam,
        search: debouncedSearch,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: open,
  });

  // ✅ FIXED INTERSECTION OBSERVER
  useEffect(() => {
    if (!loadMoreRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainerRef.current, // ✅ VERY IMPORTANT
        threshold: 0.5,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Products to add into category</DialogTitle>
        </DialogHeader>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />

        {/* ✅ SCROLL CONTAINER */}
        <div
          ref={scrollContainerRef}
          className="h-[70vh] space-y-2 overflow-y-auto"
        >
          {/* ✅ INITIAL LOADING */}
          {isFetching && !data ? (
            Array.from({ length: 8 }).map((_, i) => (
              <CategoryProductSkeleton key={i} />
            ))
          ) : error ? (
            <div>Error loading products</div>
          ) : (
            <>
              {data?.pages.map((page) =>
                page.products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setProductIds(product.id)}
                    className={cn(
                      "hover:bg-accent flex cursor-pointer items-center justify-between gap-2 rounded-md p-2",
                      productIds.includes(product.id) &&
                        "text-muted-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Image
                        src={product.images?.[0] ?? ""}
                        height={50}
                        width={50}
                        alt="product-img"
                        className="aspect-square rounded-full object-cover"
                      />
                      <span className="truncate">{product.name}</span>
                    </span>

                    {productIds.includes(product.id) ? (
                      <Minus size={15} className="mr-5" />
                    ) : (
                      <Plus size={15} className="mr-5" />
                    )}
                  </div>
                )),
              )}

              {/* ✅ LOAD MORE TRIGGER */}
              <div ref={loadMoreRef} className="py-4 text-center">
                {isFetchingNextPage && <CategoryProductSkeleton />}
                {!hasNextPage && (
                  <p className="text-muted-foreground text-sm">
                    No more products
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryProductSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="size-[50px] shrink-0 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
}
