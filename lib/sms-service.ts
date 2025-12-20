import { BetterAuthError } from "better-auth";
import "dotenv";

export async function sendSMS({
  phoneNumber,
  type,
  code,
}: {
  phoneNumber: string;
  type: "RESET_PASSWORD" | "ACCOUNT_VERFICATION";
  code: string;
}) {
  let message = "";
  if (type === "RESET_PASSWORD") {
    message = `Stylewon, your verification code is: ${code}. Valid for 1 minutes.`;
  }
  if (type === "ACCOUNT_VERFICATION") {
    message = `Stylewon, use ${code} to verify your account. Do not share this code.`;
  }
  const url = `${process.env.SMS_BASE_URL}?api_key=${process.env.SMS_API_KEY}&senderid=${process.env.SMS_SENDER_ID}&number=${phoneNumber}&message=${message}&type=text`;
  try {
    const res = await fetch(url);
    const result = (await res.json()) as { response_code: number };
    if (result.response_code === 202) {
      return true;
    }
  } catch (error) {
    throw new BetterAuthError("Sms sending failed");
  }
}
