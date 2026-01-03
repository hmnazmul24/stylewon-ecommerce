"use server";

import { db } from "@/drizzle/db";
import { Role } from "./components/update-role";
import { user } from "@/auth-schema";
import { eq } from "drizzle-orm";

export async function updateRole({
  role,
  userId,
}: {
  role: Role;
  userId: string;
}) {
  await db.update(user).set({ role }).where(eq(user.id, userId));
  return { message: "Role Updated" };
}
