import { z } from "zod";

/* ================================
   AUTH UI STATE
================================ */

export type AuthComponentSelectType =
  | "SIGN_UP"
  | "SIGN_IN"
  | "OTP_VERIFY_SIGNIN_EMAIL"
  | "OTP_VERIFY_SIGNIN_PHONE_NO"
  | "OTP_VERIFY_SIGNUP"
  | "ADD_PASSWORD"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD";

/* ================================
   SHARED VALIDATORS
================================ */

export const BD_PHONE_REGEX = /^01[0-9]{9}$/;

export const phoneOrEmailSchema = z
  .string()
  .trim()
  .refine((value) => {
    const isEmail = z.email().safeParse(value).success;
    const isPhone = BD_PHONE_REGEX.test(value);
    return isEmail || isPhone;
  }, "Enter a valid email or Bangladesh phone number");

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

/* ================================
   SIGN UP
================================ */

export const signupSchema = z.object({
  phoneNo: z
    .string()
    .min(1, "Phone number is required")
    .regex(BD_PHONE_REGEX, "Enter a valid Bangladesh phone number"),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;

/* ================================
   SIGN IN
================================ */

export const signinSchema = z.object({
  phoneOrEmail: phoneOrEmailSchema,
  password: strongPasswordSchema,
});

export type SigninSchemaType = z.infer<typeof signinSchema>;

/* ================================
   ADD PASSWORD
================================ */

export const addPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddPasswordSchemaType = z.infer<typeof addPasswordSchema>;

/* ================================
   FORGOT PASSWORD
================================ */

export const forgotPasswordSchema = z.object({
  phoneOrEmail: phoneOrEmailSchema,
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

/* ================================
   RESET PASSWORD
================================ */

export const resetPasswordSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6),
  password: strongPasswordSchema,
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

/* ================================
   UPDATE PASSWORD
================================ */

export const updatePasswordSchema = z
  .object({
    oldPassword: strongPasswordSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
