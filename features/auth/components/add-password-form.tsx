"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { addPasswordSchema, AddPasswordSchemaType } from "../schemas";
import { AuthComponentPropsType } from "../types";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";

export function AddPasswordForm({ onClose }: AuthComponentPropsType) {
  const form = useForm<AddPasswordSchemaType>({
    resolver: zodResolver(addPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: AddPasswordSchemaType) => {
      const res = await authClient.changePassword({
        currentPassword: process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD!,
        newPassword: input.password,
      });

      if (res.data) {
        onClose && onClose();
        toast.success("Signed in successfully");
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
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>New password</FieldLabel>
              <PasswordInput
                className="h-10"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Confirm password</FieldLabel>
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
            Submit
          </SubmitButtonWithLoading>
        </Field>
      </FieldGroup>
    </form>
  );
}
