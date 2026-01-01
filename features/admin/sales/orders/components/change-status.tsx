// components/ChangeStatus.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "../actions";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-100" },
  confirmed: { label: "Confirmed", color: "text-blue-600", bg: "bg-blue-100" },
  processing: {
    label: "Processing",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  shipped: { label: "Shipped", color: "text-indigo-600", bg: "bg-indigo-100" },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-100" },
  refunded: { label: "Refunded", color: "text-gray-600", bg: "bg-gray-100" },
};

export default function ChangeOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const { mutate, isPending } = useMutation({ mutationFn: changeOrderStatus });
  return (
    <ChangeStatus
      currentStatus={currentStatus}
      isPending={isPending}
      onSave={(newStatus) => {
        mutate({ orderId, status: newStatus });
      }}
    />
  );
}
interface ChangeStatusProps {
  currentStatus: OrderStatus;
  onSave: (newStatus: OrderStatus) => void;
  isPending: boolean;
}

function ChangeStatus({ currentStatus, onSave, isPending }: ChangeStatusProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  const handleSave = () => {
    onSave(status);
  };

  const currentConfig = statusConfig[status];

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
      <div className="border-b px-5 py-3">
        <h3 className="font-semibold">Update Order Status</h3>
      </div>

      <div className="space-y-5 p-5">
        {/* Current Status Badge */}
        <div>
          <p className="mb-2 text-sm">Current status</p>
          <div className="flex items-center justify-start gap-3">
            <div
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig[currentStatus].bg} ${statusConfig[currentStatus].color}`}
            >
              {statusConfig[currentStatus].label}
            </div>
            {/* Preview of selected status */}
            {status !== currentStatus && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">Will change to →</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${currentConfig.bg} ${currentConfig.color}`}
                >
                  {currentConfig.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Selector */}
        <div>
          <p className="mb-2 text-sm">Change to</p>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrderStatus)}
          >
            <SelectTrigger className="h-12 w-full text-base">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${config.bg.replace(
                        "100",
                        "500",
                      )}`}
                    />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={status === currentStatus || isPending}
          className="w-full rounded-full py-6 text-base font-medium"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : status === currentStatus ? (
            "No changes"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Card>
  );
}
