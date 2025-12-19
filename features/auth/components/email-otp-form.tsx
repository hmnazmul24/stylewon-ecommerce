"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "../hooks/use-auth-hook";
import { AuthComponentPropsType } from "../types";
import { GenericOTPVerifier } from "./generic-otp-verifier";

export function EmailOTPForm({ onClose }: AuthComponentPropsType) {
  const { signupSigninPhoneNo } = useAuthStore();

  return (
    <GenericOTPVerifier
      identifier={signupSigninPhoneNo}
      onVerify={async (otp) => {
        const res = await authClient.signIn.emailOtp({
          email: signupSigninPhoneNo,
          otp,
        });

        if (res.data)
          return {
            success: "Signed in successfully",
          };
        return { error: res.error?.message || res.error.statusText };
      }}
      onResend={async () => {
        const res = await authClient.emailOtp.sendVerificationOtp({
          email: signupSigninPhoneNo,
          type: "sign-in",
        });

        if (res.data) return { success: "OTP resent" };
        return { error: res.error?.message || res.error.statusText };
      }}
      onSuccess={() => {
        onClose && onClose();
      }}
    />
  );
}
