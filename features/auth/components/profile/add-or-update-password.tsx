"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/ui/loading-swap";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import {
  addPasswordSchema,
  AddPasswordSchemaType,
  updatePasswordSchema,
  UpdatePasswordSchemaType,
} from "@/features/auth/schemas";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ProfileComponentPropsType } from "../../types";
import { SubmitButtonWithLoading } from "../submit-button-with-loading";
import { useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowDown,
  Fingerprint,
  SquareArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import { GenericOTPVerifier } from "../generic-otp-verifier";
import { Switch } from "@/components/ui/switch";
import { createCredentialAccountIfNeeded } from "../../actions";

export function AddOrUpdatePassword(props: ProfileComponentPropsType) {
  return props.isPasswordAccountExist ? (
    <UpdatePasswordForm {...props} />
  ) : (
    <AddPassword {...props} />
  );
}

function AddPassword(props: ProfileComponentPropsType) {
  const [compType, setCompType] = useState<
    "REQUIRED_VARIFICATION" | "VERIFY" | "UPDATE"
  >("REQUIRED_VARIFICATION");
  const [isPending, startTransition] = useTransition();

  return compType === "REQUIRED_VARIFICATION" ? (
    <div className="flex flex-col items-center justify-center gap-5">
      <Button variant={"outline"} className="text-destructive">
        <AlertCircle /> Varification Required
      </Button>
      <h1 className="text-muted-foreground text-sm font-semibold">
        We will send an OTP to verify your identity
      </h1>
      <Badge>{props.user.phoneNumber ?? props.user.email}</Badge>
      <ButtonWithLoading
        onClick={() => {
          startTransition(async () => {
            const phoneNumber = props.user.phoneNumber;
            if (phoneNumber) {
              const res = await authClient.phoneNumber.sendOtp({ phoneNumber });
              if (res.data) {
                toast.success("OTP has sent");
                setCompType("VERIFY");
              }
              if (res.error) {
                toast.error(res.error.message || res.error.statusText);
              }
            } else {
              const res = await authClient.emailOtp.sendVerificationOtp({
                email: props.user.email,
                type: "email-verification",
              });
              if (res.data) {
                toast.success("OTP has sent");
                setCompType("VERIFY");
              }
              if (res.error) {
                toast.error(res.error.message || res.error.statusText);
              }
            }
          });
        }}
        type="button"
        isPending={isPending}
      >
        Send OTP
      </ButtonWithLoading>
    </div>
  ) : compType === "VERIFY" ? (
    <GenericOTPVerifier
      identifier={props.user.phoneNumber ?? props.user.email}
      onVerify={async (otp) => {
        const phoneNumber = props.user.phoneNumber;
        if (phoneNumber) {
          const res = await authClient.phoneNumber.verify({
            phoneNumber: phoneNumber,
            code: otp,
          });

          await createCredentialAccountIfNeeded();
          if (res.data) {
            return {
              success: "OTP is verified",
            };
          }
          return { error: res.error?.message || res.error.statusText };
        } else {
          const res = await authClient.emailOtp.verifyEmail({
            email: props.user.email,
            otp,
          });
          await createCredentialAccountIfNeeded();
          if (res.data) {
            return {
              success: "OTP is verified",
            };
          }
          return { error: res.error?.message || res.error.statusText };
        }
      }}
      onResend={async () => {
        const phoneNumber = props.user.phoneNumber;
        if (phoneNumber) {
          const res = await authClient.phoneNumber.sendOtp({ phoneNumber });
          if (res.data) return { success: "OTP resent" };
          return { error: res.error?.message || res.error.statusText };
        } else {
          const res = await authClient.emailOtp.sendVerificationOtp({
            email: props.user.email,
            type: "email-verification",
          });
          if (res.data) return { success: "OTP resent" };
          return { error: res.error?.message || res.error.statusText };
        }
      }}
      onSuccess={() => {
        setCompType("UPDATE");
      }}
    />
  ) : (
    <AddPasswordForm {...props} />
  );
}

function AddPasswordForm(props: ProfileComponentPropsType) {
  const qc = getQueryClient();
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
        toast.success("Password updated");
        await qc.invalidateQueries({ queryKey: ["user-info"] });
        props.onSuccess && props.onSuccess();
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
          <Button className="h-10" disabled={isPending}>
            <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function UpdatePasswordForm({ onSuccess }: ProfileComponentPropsType) {
  const qc = getQueryClient();
  const form = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: UpdatePasswordSchemaType) => {
      const res = await authClient.changePassword({
        currentPassword: input.oldPassword,
        newPassword: input.password,
      });

      if (res.data) {
        toast.success("Password updated");
        await qc.invalidateQueries({ queryKey: ["user-info"] });
        onSuccess && onSuccess();
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
          name="oldPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Current password</FieldLabel>
              <FieldDescription className="flex items-center justify-between gap-2">
                <span>
                  If you haven&apos;t changed the password, use default password
                </span>{" "}
                <Switch
                  onCheckedChange={(v) =>
                    v
                      ? form.setValue(
                          "oldPassword",
                          process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD!,
                        )
                      : form.setValue("oldPassword", "")
                  }
                />
              </FieldDescription>
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

        <SubmitButtonWithLoading isPending={isPending}>
          Submit{" "}
        </SubmitButtonWithLoading>
      </FieldGroup>
    </form>
  );
}
