"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { detectInputType } from "../helpers";
import { useAuthStore } from "../hooks/use-auth-hook";
import { signinSchema, SigninSchemaType } from "../schemas";
import { AuthComponentPropsType } from "../types";
import GoogleSignInButton from "./google-signin-button";

const DUMMY_PASSWROD_TO_USE_OTP_SIGNIN = "12345678";

export function SignInForm({
  switchComponentTo,
  onClose,
}: AuthComponentPropsType) {
  const { setSignupSigninPhoneNo } = useAuthStore();
  const [signinType, setSigninType] = useState<"PASSWORD" | "OTP">("PASSWORD");
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      phoneOrEmail: "",
      password: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: SigninSchemaType) => {
      if (signinType === "PASSWORD") {
        const type = detectInputType(input.phoneOrEmail);
        if (type === "email") {
          const res = await authClient.signIn.email({
            email: input.phoneOrEmail,
            password: input.password,
          });
          if (res.data) {
            toast.success("Signed in successfully");
            onClose && onClose();
          }
          if (res.error) {
            toast.error(res.error.message || res.error.statusText);
          }
        }
        if (type === "phone") {
          const res = await authClient.signIn.phoneNumber({
            password: input.password,
            phoneNumber: input.phoneOrEmail,
          });
          if (res.data) {
            toast.success("Signed in successfully");
            onClose && onClose();
          }
          if (res.error) {
            toast.error(res.error.message || res.error.statusText);
          }
        }
      }
      if (signinType === "OTP") {
        const type = detectInputType(input.phoneOrEmail);
        if (type === "email") {
          const res = await authClient.emailOtp.sendVerificationOtp({
            email: input.phoneOrEmail,
            type: "sign-in",
          });
          if (res.data) {
            setSignupSigninPhoneNo(input.phoneOrEmail);
            toast.success("OTP has sent");
            switchComponentTo && switchComponentTo("OTP_VERIFY_SIGNIN_EMAIL");
          }
          if (res.error) {
            toast.error(res.error.message || res.error.statusText);
          }
        }
        if (type === "phone") {
          const res = await authClient.phoneNumber.sendOtp({
            phoneNumber: input.phoneOrEmail,
          });
          if (res.data) {
            setSignupSigninPhoneNo(input.phoneOrEmail);
            toast.success("OTP has sent");
            switchComponentTo &&
              switchComponentTo("OTP_VERIFY_SIGNIN_PHONE_NO");
          }
          if (res.error) {
            toast.error(res.error.message || res.error.statusText);
          }
        }
      }
    },
  });

  return (
    <div className="space-y-6 py-6">
      <form onSubmit={form.handleSubmit((v) => mutate(v))}>
        <FieldGroup className="gap-4">
          <Controller
            name="phoneOrEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="justify-between">
                  <span>Phone number or email</span>{" "}
                  {signinType === "OTP" ? (
                    <span
                      onClick={() => {
                        setSigninType("PASSWORD");
                        form.setValue("password", "");
                      }}
                      className="underline"
                    >
                      Use password
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        setSigninType("OTP");
                        form.setValue(
                          "password",
                          DUMMY_PASSWROD_TO_USE_OTP_SIGNIN,
                        );
                      }}
                      className="underline"
                    >
                      Use OTP instead
                    </span>
                  )}
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
          {signinType === "PASSWORD" && (
            <Fragment>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <PasswordInput
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
              <div className="mb-3 flex items-center justify-end text-sm underline">
                <span
                  onClick={() =>
                    switchComponentTo && switchComponentTo("FORGOT_PASSWORD")
                  }
                >
                  Forgot password?
                </span>
              </div>
            </Fragment>
          )}

          <Field>
            <Button className="h-10" disabled={isPending}>
              <LoadingSwap isLoading={isPending}>
                {signinType === "OTP" ? "Send OTP" : "Submit"}
              </LoadingSwap>
            </Button>
          </Field>
          <Field>
            <FieldTitle>
              Don&apos;t have any account ?{" "}
              <div
                className="cursor-pointer"
                onClick={() =>
                  switchComponentTo && switchComponentTo("SIGN_UP")
                }
              >
                Sign up
              </div>
            </FieldTitle>
          </Field>
        </FieldGroup>
      </form>

      <Separator className="relative mb-10">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent p-2">
          Or
        </span>
      </Separator>
      <Field>
        <GoogleSignInButton />
      </Field>
    </div>
  );
}
