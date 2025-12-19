"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getOrderSummery } from "../../server/billing.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function OrderSummery() {
  const { data } = useSuspenseQuery({
    queryKey: ["order_summery"],
    queryFn: () => getOrderSummery(),
  });

  return (
    <Card className="rounded-none border-none p-0 pt-5">
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-base font-semibold">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {/* Items */}
        <div className="space-y-4">
          {data.cartsInfo.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Image */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    height={50}
                    width={50}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-muted h-full w-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col">
                <p className="text-sm leading-tight font-medium">{item.name}</p>

                {(item.size || item.color) && (
                  <p className="text-muted-foreground text-xs">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && " · "}
                    {item.color && <span>Color: {item.color}</span>}
                  </p>
                )}

                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-medium">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
