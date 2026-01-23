"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "../hooks/use-auth-hook";
import { AuthComponentPropsType } from "../types";
import { GenericOTPVerifier } from "./generic-otp-verifier";

export function PhoneNoOTPForm({
  switchComponentTo,
  onClose,
  type,
  onSuccessfullSignUp,
}: AuthComponentPropsType & { type: "SIGNIN" | "SIGNUP" }) {
  const { signupSigninPhoneNo } = useAuthStore();

  return (
    <GenericOTPVerifier
      identifier={signupSigninPhoneNo}
      onVerify={async (otp) => {
        const res = await authClient.phoneNumber.verify({
          phoneNumber: signupSigninPhoneNo,
          code: otp,
        });

        if (res.data)
          return {
            success:
              type === "SIGNIN" ? "Signed in successfully" : "OTP verified",
          };
        return { error: res.error?.message || res.error.statusText };
      }}
      onResend={async () => {
        const res = await authClient.phoneNumber.sendOtp({
          phoneNumber: signupSigninPhoneNo,
        });

        if (res.data) return { success: "OTP resent" };
        return { error: res.error?.message || res.error.statusText };
      }}
      onSuccess={() => {
        if (type === "SIGNIN") {
          onClose && onClose();
        }
        if (type === "SIGNUP") {
          onSuccessfullSignUp && onSuccessfullSignUp();
          switchComponentTo && switchComponentTo("ADD_PASSWORD");
        }
      }}
    />
  );
}
