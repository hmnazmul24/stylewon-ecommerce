"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search & Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-52 h-8 md:h-10 " />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="w-16 h-8 md:h-10" />
          <Skeleton className="w-16 h-8 md:h-10" />
        </div>
      </div>

      {/* Table */}
      <div className="border-l  rounded-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 gap-5 px-4 py-3 border-b">
          <Skeleton className="h-5"></Skeleton>
          <Skeleton className="h-5"></Skeleton>
        </div>

        {/* Skeleton Rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-2 items-center px-4 py-3 border-b last:border-0"
          >
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-5 w-20 justify-self-start" />
          </div>
        ))}
      </div>
    </div>
  );
}
