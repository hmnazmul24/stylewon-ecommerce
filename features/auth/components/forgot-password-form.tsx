"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "../hooks/use-auth-hook";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "../schemas";
import { AuthComponentPropsType } from "../types";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";

export function ForgotPasswordForm({
  switchComponentTo,
}: AuthComponentPropsType) {
  const { setSignupSigninPhoneNo } = useAuthStore();
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phoneOrEmail: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: ForgotPasswordSchemaType) => {
      const res = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: input.phoneOrEmail,
      });

      if (res.data) {
        setSignupSigninPhoneNo(input.phoneOrEmail);
        toast.success("OTP has sent");
        switchComponentTo && switchComponentTo("RESET_PASSWORD");
      }
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit((v) => mutate(v))}>
      <FieldGroup className="gap-4">
        <Controller
          name="phoneOrEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Phone number or email</FieldLabel>
              <Input
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
            Submit
          </SubmitButtonWithLoading>
        </Field>
      </FieldGroup>
    </form>
  );
}
