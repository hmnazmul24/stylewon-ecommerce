"use client";

import { ChevronRight } from "lucide-react";
import { Heading } from "../shared/heading";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCategories } from "../../server/queries";
import { Button } from "@/components/ui/button";

export function HomeCategories() {
  const { data } = useSuspenseQuery({
    queryKey: ["marketing-categories"],
    queryFn: () => getCategories(),
  });
  return (
    <section className="w-full px-2 md:px-0">
      <div className="mx-auto max-w-5xl">
        <Heading className="justify-center">Categories</Heading>

        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
          {data.map((category, index) => (
            <div
              key={category.id}
              className="to-secondary flex items-center justify-between rounded-sm bg-linear-to-r from-transparent p-4 py-6"
            >
              <span className="truncate">{category.categoryName}</span>
              <ChevronRight
                className="rounded-full text-emerald-900"
                size={20}
              />
            </div>
          ))}
        </div>

        {data.length > 8 && (
          <div className="mt-10 text-center sm:hidden">
            <button className="inline-flex items-center font-medium">
              View all categories
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
