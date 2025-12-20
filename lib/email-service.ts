"use server";

import {
  EmailVerificationLinkTemplate,
  EmailVerificationOtpTemplate,
} from "@/components/templates/email-templates";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendEmailOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Stylewon <no-reply@stylewon.com>",
      to: [email],
      subject: "Email Verficiation",
      react: EmailVerificationOtpTemplate({
        expiresInMinutes: 1,
        otp,
      }),
    });

    if (error) {
      return { error, status: 500 };
    }

    return data;
  } catch (error) {
    return { error, status: 500 };
  }
}
//----------------------------------------link--------------------------//
export async function sendEmailLink({
  email,
  verifyUrl,
}: {
  email: string;
  verifyUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Stylewon <no-reply@stylewon.com>",
      to: [email],
      subject: "Email Verficiation",
      react: EmailVerificationLinkTemplate({
        expiresInMinutes: 1,
        verifyUrl,
      }),
    });

    if (error) {
      return { error, status: 500 };
    }

    return data;
  } catch (error) {
    return { error, status: 500 };
  }
}
