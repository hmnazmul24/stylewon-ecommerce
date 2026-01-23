"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { cancelOrder, getOrders } from "../../server/account.order";

export function OrderListing() {
  const qc = getQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: ["order-listings"],
    queryFn: () => getOrders(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: async ({ message }) => {
      toast.success(message);
      await qc.invalidateQueries({ queryKey: ["order-listings"] });
    },
  });

  if (!data.length) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-20 text-sm">
        No orders found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((order) => (
        <Card key={order.id} className="rounded-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold">
                Order #{order.id}
              </CardTitle>

              <div className="flex items-center justify-center">
                <Badge variant="outline" className="capitalize">
                  {order.status}
                </Badge>
                {order.status === "pending" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"ghost"} size={"icon-sm"}>
                        <MoreVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex max-w-52 flex-col items-center gap-2 text-sm">
                      <h2 className="text-center">
                        do you want to cancel this order?
                      </h2>
                      <Button
                        disabled={isPending}
                        onClick={() => mutate({ orderId: order.id })}
                        variant={"destructive"}
                      >
                        Cancel
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span>{order.paymentMethod}</span>
              <span>
                {order.deleveryArea} • ৳{order.deleveryAmount}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Order Items */}
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <p className="text-sm leading-tight font-medium">
                      {item.name}
                    </p>

                    <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium">৳{item.price}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold">৳{order.totalAmount}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
