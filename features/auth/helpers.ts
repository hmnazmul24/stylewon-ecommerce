import z from "zod";

export function detectInputType(value: string): "email" | "phone" | "invalid" {
  const bdPhoneRegex = /^01[0-9]{9}$/;

  const isEmail = z.email().safeParse(value).success;
  const isPhone = bdPhoneRegex.test(value);

  if (isEmail) return "email";
  if (isPhone) return "phone";

  return "invalid";
}
