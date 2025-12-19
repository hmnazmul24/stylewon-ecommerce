"use client";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";
import { useState } from "react";
import { AuthComponentSelectType } from "../schemas";
import { AddPasswordForm } from "./add-password-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { PhoneNoOTPForm } from "./phone-no-otp-form";
import { ResetPasswordForm } from "./reset-password-form";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";
import { EmailOTPForm } from "./email-otp-form";

export function CompletedAuthBox({ onClose }: { onClose?: () => void }) {
  const [viewAuthComp, setViewAuthComp] =
    useState<AuthComponentSelectType>("SIGN_IN");
  return (
    <div>
      <FieldGroup>
        {viewAuthComp === "SIGN_UP" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">Sign Up</FieldTitle>
            <FieldContent>
              <SignUpForm switchComponentTo={setViewAuthComp} />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "SIGN_IN" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">Sign In</FieldTitle>
            <FieldContent>
              <SignInForm
                onClose={onClose}
                switchComponentTo={setViewAuthComp}
              />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "OTP_VERIFY_SIGNIN_PHONE_NO" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">OTP Verify</FieldTitle>
            <FieldContent>
              <PhoneNoOTPForm
                onClose={onClose}
                type="SIGNIN"
                switchComponentTo={setViewAuthComp}
              />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "OTP_VERIFY_SIGNIN_EMAIL" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">OTP Verify</FieldTitle>
            <FieldContent>
              <EmailOTPForm
                onClose={onClose}
                switchComponentTo={setViewAuthComp}
              />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "OTP_VERIFY_SIGNUP" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">OTP Verify</FieldTitle>
            <FieldContent>
              <PhoneNoOTPForm
                type="SIGNUP"
                switchComponentTo={setViewAuthComp}
              />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "FORGOT_PASSWORD" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">
              Forgot Password
            </FieldTitle>
            <FieldContent>
              <ForgotPasswordForm switchComponentTo={setViewAuthComp} />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "RESET_PASSWORD" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">
              Reset Password
            </FieldTitle>
            <FieldContent>
              <ResetPasswordForm switchComponentTo={setViewAuthComp} />
            </FieldContent>
          </Field>
        ) : viewAuthComp === "ADD_PASSWORD" ? (
          <Field>
            <FieldTitle className="text-xl font-bold">Add Password</FieldTitle>
            <FieldContent>
              <AddPasswordForm onClose={onClose} />
            </FieldContent>
          </Field>
        ) : null}
      </FieldGroup>
    </div>
  );
}
