"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getBillingsInfo } from "../../server/billing.actions";

export function ExistedBillingInfo() {
  const {
    data: { billings: info },
  } = useSuspenseQuery({
    queryKey: ["billings"],
    queryFn: () => getBillingsInfo(),
  });
  return (
    <div className="space-y-2 rounded-xl">
      {/* Content */}
      <div className="grid grid-cols-2 space-y-2 text-sm">
        <InfoRow label="Full Name" value={info.fullName} />
        <InfoRow label="Phone" value={info.phone} />
        <InfoRow label="District" value={info.districtId} />
        <InfoRow label="Upazila" value={info.upazilaId} />
        <InfoRow label="Address" value={info.address} />

        {info.email && <InfoRow label="Email" value={info.email} />}
        {info.note && <InfoRow label="Note" value={info.note} />}
      </div>

      {/* Action */}
      <div className="pt-2">
        <Link href={"/checkout?redirect_to=payment"}>
          {" "}
          <Button type="button" variant="outline" className="w-full">
            <Edit /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Small helper for consistent rows */
/* ---------------------------------- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
