"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Countdown from "react-countdown";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "../hooks/use-auth-hook";
import { resetPasswordSchema, ResetPasswordSchemaType } from "../schemas";
import { AuthComponentPropsType } from "../types";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";

export function ResetPasswordForm({
  switchComponentTo,
}: AuthComponentPropsType) {
  const { signupSigninPhoneNo } = useAuthStore();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: ResetPasswordSchemaType) => {
      const res = await authClient.phoneNumber.resetPassword({
        otp: input.otp,
        newPassword: input.password,
        phoneNumber: signupSigninPhoneNo,
      });

      if (res.data) {
        switchComponentTo && switchComponentTo("SIGN_IN");
        toast.success("New password has set. Now singin");
      }
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit((v) => mutate(v))}>
      <FieldGroup className="gap-4">
        <div>
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center justify-between">
                  <span>OTP code</span>
                  <CountDownAndReset />
                </FieldLabel>
                <Input
                  className="h-10"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>New Password</FieldLabel>
              <PasswordInput
                className="h-10"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <SubmitButtonWithLoading isPending={isPending}>
            Send OTP{" "}
          </SubmitButtonWithLoading>
        </Field>
      </FieldGroup>
    </form>
  );
}

function CountDownAndReset() {
  const [data, setData] = useState(() => Date.now() + 1000 * 30);
  const { signupSigninPhoneNo } = useAuthStore();
  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: signupSigninPhoneNo,
      });
      if (res.data) {
        toast.success("OTP has sent again");
      }
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },

    onSuccess: () => {
      setData(Date.now() + 1000 * 30);
    },
  });
  return (
    <div>
      <LoadingSwap isLoading={resendMutation.isPending}>
        <Countdown
          key={data}
          date={data}
          renderer={({ minutes, seconds, completed }) => {
            if (completed) {
              return (
                <div
                  onClick={(e) => {
                    resendMutation.mutate();
                  }}
                  className="underline"
                >
                  Resend
                </div>
              );
            } else {
              return (
                <span className="font-bold">
                  {minutes} : {seconds}
                </span>
              );
            }
          }}
        />
      </LoadingSwap>
    </div>
  );
}
