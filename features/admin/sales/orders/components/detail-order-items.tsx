"use client";
import { formatTaka } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getOrdersItems } from "../actions";

// Mobile Skeleton Item
function MobileSkeletonItem() {
  return (
    <div className="flex animate-pulse gap-4 border-b p-4">
      <div className="h-20 w-20 rounded-lg" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 w-3/4 rounded" />
        <div className="h-4 w-1/2 rounded" />
        <div className="h-6 w-28 rounded" />
      </div>
    </div>
  );
}

export default function DetailOrdersItems({ orderId }: { orderId: string }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["orders-items", orderId],
    queryFn: () => getOrdersItems({ orderId }),
  });

  // Loading State - Mobile Skeletons
  if (isPending) {
    return (
      <div className="">
        <div className="px-4 pt-4 pb-2">
          <div className="h-7 w-32 animate-pulse rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <MobileSkeletonItem key={i} />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="border-t-4 border-red-500 p-4 text-center">
        <p className="font-medium text-red-700">Failed to load items</p>
      </div>
    );
  }

  // Empty State
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No items in this order</p>
      </div>
    );
  }

  const totalAmount = data.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0,
  );

  return (
    <div className="mt-4 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b px-5 pt-4 pb-3">
        <h3 className="text-lg font-semibold">Order Items</h3>
        <p className="mt-1 text-sm">
          {data.length} item{data.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Items List */}
      <div className="divide-y">
        {data.map((item) => {
          const itemTotal = item.quantity * Number(item.price);

          return (
            <div key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        className="h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-base font-medium">
                    {item.name}
                  </h4>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      {item.quantity} × {formatTaka(item.price)}
                    </p>
                    <p className="text-base font-semibold">
                      {formatTaka(itemTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary - Sticky Bottom */}
      <div className="sticky bottom-0 mt-4 border-t px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium">Total Amount</span>
          <span className="text-xl font-bold">{formatTaka(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
