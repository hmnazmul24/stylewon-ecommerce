"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileComponentPropsType } from "../../types";
import { GenericOTPVerifier } from "../generic-otp-verifier";
import { GenericPhoneInputForm } from "../generic-phone-input-form";
import { getQueryClient } from "@/tanstack-query/get-query-client";

export function AddOrUpdatePhoneNumber({
  user,
  onSuccess,
}: ProfileComponentPropsType) {
  const qc = getQueryClient();
  const [compType, setCompType] = useState<"SEND" | "VERIFY">("SEND");
  const [phoneNumber, setPhoneNumber] = useState("");
  return compType === "SEND" ? (
    <GenericPhoneInputForm
      key={1}
      defaultValue={user.phoneNumber ?? ""}
      submitLabel="Send OTP"
      onSubmit={async (input) => {
        if (user.phoneNumber === input.phoneNo) {
          toast.info("You haven't changed anything");
          return;
        }
        const res = await authClient.phoneNumber.sendOtp({
          phoneNumber: input.phoneNo,
        });
        if (res.data) {
          toast.success("OTP has sent");
          setPhoneNumber(input.phoneNo);
          setCompType("VERIFY");
        }
        if (res.error) {
          toast.error(res.error.message || res.error.statusText);
        }
      }}
    />
  ) : (
    <GenericOTPVerifier
      identifier={phoneNumber}
      onVerify={async (otp) => {
        const res = await authClient.phoneNumber.verify({
          phoneNumber: phoneNumber,
          code: otp,
          updatePhoneNumber: true,
        });

        if (res.data) {
          await qc.invalidateQueries({ queryKey: ["user-info"] });
          return {
            success: "OTP is verified",
          };
        }
        return { error: res.error?.message || res.error.statusText };
      }}
      onResend={async () => {
        const res = await authClient.phoneNumber.sendOtp({
          phoneNumber,
        });

        if (res.data) return { success: "OTP resent" };
        return { error: res.error?.message || res.error.statusText };
      }}
      onSuccess={() => {
        onSuccess && onSuccess();
      }}
    />
  );
}
