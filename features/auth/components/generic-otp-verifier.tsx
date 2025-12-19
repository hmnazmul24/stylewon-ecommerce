"use client";

import Countdown from "react-countdown";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";
import { useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { OTP_EXPIRE_IN_SECONDS } from "@/lib/constants";

type OTPVerifierProps = {
  identifier: string; // phone or email

  otpLength?: number;
  resendDuration?: number;

  onVerify: (otp: string) => Promise<{
    success?: string;
    error?: string;
  }>;

  onResend: () => Promise<{
    success?: string;
    error?: string;
  }>;

  onSuccess?: () => void;
  header?: ReactNode;
  submitLabel?: string;
};

export function GenericOTPVerifier({
  identifier,

  otpLength = 6,
  resendDuration = OTP_EXPIRE_IN_SECONDS,

  onVerify,
  onResend,
  onSuccess,

  header,
  submitLabel = "Submit",
}: OTPVerifierProps) {
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(Date.now() + 1000 * resendDuration);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (value.length === otpLength) {
      handleVerify();
    }
  }, [value]);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const res = await onVerify(value);

      if (res.success) {
        toast.success(res.success);
        onSuccess?.();
      }

      if (res.error) {
        toast.error(res.error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setValue("");

      const res = await onResend();

      if (res.success) toast.success(res.success);
      if (res.error) toast.error(res.error);

      setTimer(Date.now() + 1000 * resendDuration);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      {header ?? (
        <h2 className="text-muted-foreground text-center text-sm">
          We sent an OTP to <span className="font-semibold">{identifier}</span>
        </h2>
      )}

      {/* OTP INPUT */}
      <InputOTP
        disabled={isVerifying}
        value={value}
        onChange={setValue}
        maxLength={otpLength}
      >
        <InputOTPGroup className="w-full gap-2">
          {Array.from({ length: otpLength }).map((_, i) => (
            <InputOTPSlot
              key={i}
              className="h-12 w-12 rounded-sm border"
              index={i}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {/* RESEND */}
      <LoadingSwap isLoading={isResending}>
        <Countdown
          key={timer}
          date={timer}
          renderer={({ minutes, seconds, completed }) => {
            if (completed) {
              return (
                <button onClick={handleResend} className="text-sm underline">
                  Resend
                </button>
              );
            }

            return (
              <span className="text-sm font-semibold">
                {minutes} : {seconds}
              </span>
            );
          }}
        />
      </LoadingSwap>

      {/* SUBMIT */}
      <SubmitButtonWithLoading isPending={isVerifying}>
        {submitLabel}
      </SubmitButtonWithLoading>
    </div>
  );
}
