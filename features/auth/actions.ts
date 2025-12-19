"use server";

import { user } from "@/auth-schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { account } from "@/auth-schema";
import { auth } from "@/lib/auth";
import { hashPassword } from "better-auth/crypto";
import { and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserInfo() {
  const [session, accounts] = await Promise.all([
    await auth.api.getSession({ headers: await headers() }),
    await auth.api.listUserAccounts({ headers: await headers() }),
  ]);

  if (!session) {
    redirect("/");
  }

  let userData = session.user;
  const isPasswordAccountExist = !!accounts.find(
    (a) => a.providerId === "credential",
  );
  if (session.user.email.includes("@my-site.com")) {
    userData.email = "";
  }
  if (session.user.name === session.user.phoneNumber) {
    session.user.name = "";
  }

  return { user: userData, isPasswordAccountExist };
}

export async function addPhoneNumber({ phoneNo }: { phoneNo: string }) {
  const res = await auth.api.getSession({ headers: await headers() });
  if (!res) {
    redirect("/");
  }
  const [isPhoneNumberExist] = await db
    .select()
    .from(user)
    .where(eq(user.phoneNumber, phoneNo));
  if (isPhoneNumberExist) {
    return true;
  }
  await db
    .update(user)
    .set({ phoneNumber: phoneNo })
    .where(eq(user.id, res.user.id));
  return false;
}

export async function createCredentialAccountIfNeeded() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }
  const [isAccountExist] = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, session.user.id),
        eq(account.providerId, "credential"),
      ),
    );
  if (!isAccountExist) {
    const password = await hashPassword(process.env.DEFAULT_USER_PASSWORD!);
    await db.insert(account).values({
      accountId: crypto.randomUUID(),
      id: crypto.randomUUID(),
      providerId: "credential",
      userId: session.user.id,
      password,
    });
  }
}

export async function isPhoneNumberExist(phoneNumber: string) {
  const [existPhoneNumber] = await db
    .select({ phnNo: user.phoneNumber })
    .from(user)
    .where(eq(user.phoneNumber, phoneNumber));
  return existPhoneNumber && existPhoneNumber.phnNo === phoneNumber;
}
