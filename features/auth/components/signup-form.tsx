"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPhoneNumberExist } from "../actions";
import { useAuthStore } from "../hooks/use-auth-hook";
import { signupSchema, SignupSchemaType } from "../schemas";
import { AuthComponentPropsType } from "../types";
import GoogleSignInButton from "./google-signin-button";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";

export function SignUpForm({
  switchComponentTo,
  onSuccessfullSignUp,
}: AuthComponentPropsType) {
  const { setSignupSigninPhoneNo } = useAuthStore();
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      phoneNo: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: SignupSchemaType) => {
      const existPhoneNumber = await isPhoneNumberExist(input.phoneNo);
      if (existPhoneNumber) {
        return toast.error("Phone number already exists, try another");
      }

      const res = await authClient.phoneNumber.sendOtp({
        phoneNumber: input.phoneNo,
      });
      if (res.data) {
        setSignupSigninPhoneNo(input.phoneNo);
        toast.success("OTP has sent");
        switchComponentTo && switchComponentTo("OTP_VERIFY_SIGNUP");
      }
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },
  });

  return (
    <div className="space-y-6 py-6">
      <form onSubmit={form.handleSubmit((v) => mutate(v))}>
        <FieldGroup className="gap-4">
          <Controller
            name="phoneNo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone number</FieldLabel>
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

          <Field>
            <SubmitButtonWithLoading isPending={isPending}>
              Send OTP via SMS
            </SubmitButtonWithLoading>
          </Field>
          <Field>
            <FieldTitle>
              Already have an account ?{" "}
              <div
                className="cursor-pointer"
                onClick={() =>
                  switchComponentTo && switchComponentTo("SIGN_IN")
                }
              >
                Sign in
              </div>
            </FieldTitle>
          </Field>
        </FieldGroup>
      </form>

      <Separator className="relative">
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
