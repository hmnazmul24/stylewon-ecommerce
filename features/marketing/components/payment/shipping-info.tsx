"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcMoneyTransfer } from "react-icons/fc";
import { toast } from "sonner";
import {
  getDeliveryPrices,
  getOrderSummery,
} from "../../server/billing.actions";
import { placeOrder } from "../../server/placeorder.action";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { cn } from "@/lib/utils";

type ShippingMethod = "outside_dhaka" | "inside_dhaka";
type PaymentMethod = "cod" | "bkash" | "pathao" | "card";

export function ShippingInfo() {
  const router = useRouter();
  const qc = getQueryClient();

  // ...............states.............
  const [shipping, setShipping] = useState<ShippingMethod>("outside_dhaka");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");

  //...........queries..................
  const { data } = useSuspenseQuery({
    queryKey: ["delivery_prices"],
    queryFn: () => getDeliveryPrices(),
  });
  const {
    data: { totalAcount },
  } = useSuspenseQuery({
    queryKey: ["order_summery"],
    queryFn: () => getOrderSummery(),
  });

  //............mutations.................
  const { mutate, isPending } = useMutation({
    mutationFn: placeOrder,
    onSuccess: async ({ message }) => {
      await qc.invalidateQueries({ queryKey: ["user-cart"] });
      toast.success(message);
      router.push("/");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const shippingFee =
    shipping === "outside_dhaka" ? data.outsideDhaka : data.insideDhaka;

  const totalAmount = totalAcount + shippingFee;

  return (
    <div className="space-y-6 text-sm">
      {/* Coupon */}
      <Button
        variant={"secondary"}
        type="button"
        onClick={() => setShowCoupon((p) => !p)}
        className="font-medium"
      >
        Apply Coupon / Voucher?
      </Button>

      {showCoupon && (
        <div className="flex gap-2">
          <Input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <Button className="rounded-md bg-black px-4 text-sm text-white">
            Apply
          </Button>
        </div>
      )}

      {/* Shipping Method */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Choose Shipping Method</h3>

        <RadioRow
          label="Delivery Outside Dhaka"
          value="outside_dhaka"
          checked={shipping}
          onChange={setShipping}
          price={`৳ ${data.outsideDhaka.toFixed(2)}`}
        />

        <RadioRow
          label="Delivery Inside Dhaka"
          value="inside_dhaka"
          checked={shipping}
          onChange={setShipping}
          price={`৳ ${data.insideDhaka.toFixed(2)}`}
        />
      </div>

      {/* Price Summary */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>৳ {totalAcount.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-base font-semibold">
          <span>Total Amount</span>
          <span>৳ {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Choose Payment Method</h3>

        <RadioRow
          label="Cash on delivery"
          value="cod"
          checked={payment}
          onChange={setPayment}
        />
        <RadioRow
          disabled
          label="Bkash"
          value="bkash"
          checked={payment}
          onChange={setPayment}
        />
        <RadioRow
          disabled
          label="Pathao Pay"
          value="pathao"
          checked={payment}
          onChange={setPayment}
        />
        <RadioRow
          disabled
          label="Pay with Card/Mobile Wallet"
          value="card"
          checked={payment}
          onChange={setPayment}
        />
      </div>

      {/* Place Order */}
      <Button
        onClick={() =>
          mutate({
            totalAmount,
            deliveryAmount: shippingFee,
            deliveryArea: shipping,
            paymentMethod: payment,
          })
        }
        disabled={isPending}
        className="w-full"
      >
        <LoadingSwap isLoading={isPending}>
          <FcMoneyTransfer />
        </LoadingSwap>{" "}
        Place Order
      </Button>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Radio Row */
/* ---------------------------------- */

interface RadioRowProps<T extends string> {
  label: string;
  value: T;
  checked: T;
  onChange: (v: T) => void;
  price?: string;
  disabled?: boolean;
}

function RadioRow<T extends string>({
  label,
  value,
  checked,
  onChange,
  price,
  disabled = false,
}: RadioRowProps<T>) {
  return (
    <label className="flex items-center justify-between">
      <div
        className={cn(
          "flex items-center gap-2",
          disabled && "text-muted-foreground",
        )}
      >
        <input
          disabled={disabled}
          type="radio"
          checked={checked === value}
          onChange={() => onChange(value)}
          className="accent-destructive"
        />
        <span>{label}</span>
      </div>

      {price && <span>{price}</span>}
    </label>
  );
}
