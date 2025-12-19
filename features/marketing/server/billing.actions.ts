"use server";

import { db } from "@/drizzle/db";
import { carts, defaultDeliveryCharge } from "@/drizzle/schema";
import { billingInfo } from "@/drizzle/schemas/billings";
import { auth } from "@/lib/auth";
import { generateNumericOTP } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingSchemaType } from "../schemas";

type BillingInfoType = Omit<
  typeof billingInfo.$inferSelect,
  "createdAt" | "updatedAt" | "userId" | "id"
>;
export async function getBillingsInfo() {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }

  let billings: BillingInfoType;
  const [res] = await db
    .select()
    .from(billingInfo)
    .where(eq(billingInfo.userId, account.user.id));
  if (res) {
    billings = res;
  } else {
    billings = {
      fullName:
        account.user.name !== account.user.phoneNumber ? account.user.name : "",
      email: account.user.email.includes("@my-site.com")
        ? ""
        : account.user.email,
      phone: account.user.phoneNumber ?? "",
      address: "",
      upazilaId: "",
      districtId: "",
      note: "",
    };
  }

  return { billings };
}
export async function updateBillingsInfo(inputs: BillingSchemaType) {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }
  const [billings] = await db
    .select()
    .from(billingInfo)
    .where(eq(billingInfo.userId, account.user.id));
  if (!billings) {
    return db
      .insert(billingInfo)
      .values({ ...inputs, userId: account.user.id });
  }

  const isChanged =
    billings.fullName !== inputs.fullName ||
    billings.email !== inputs.email ||
    billings.phone !== inputs.phone ||
    billings.upazilaId !== inputs.upazilaId ||
    billings.districtId !== inputs.districtId ||
    billings.note !== inputs.note;
  if (!isChanged) {
    return billings;
  }
  await db
    .update(billingInfo)
    .set({ ...inputs })
    .where(eq(billingInfo.userId, account.user.id));

  return billings;
}

export async function sendOtpPhoneNumberVerify({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  await new Promise((res) => setTimeout(res, 100));
  const otp = generateNumericOTP();
  // todo : send otp to phone

  console.log(phoneNumber, "==>", otp);
  return { otp };
}
export async function getDeliveryPrices() {
  const [res] = await db.select().from(defaultDeliveryCharge);
  return res;
}
export async function getOrderSummery() {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }
  const cartsInfo = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, account.user.id));
  const totalAcount = cartsInfo.reduce(
    (prev, current) => prev + current.price * current.quantity,
    0,
  );
  return { cartsInfo, totalAcount };
}
