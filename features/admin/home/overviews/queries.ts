"use server";

import { db } from "@/drizzle/db";
import { brands, categories, products, user } from "@/drizzle/schema";
import { count } from "drizzle-orm";

export async function getDashboardData() {
  const res = await Promise.all([
    await db.select({ productCount: count() }).from(products),
    await db.select({ categoryCount: count() }).from(categories),
    await db.select({ usersCount: count() }).from(user),
    await db.select({ brandCount: count() }).from(brands),
  ]);
  const [
    [{ productCount }],
    [{ categoryCount }],
    [{ usersCount }],
    [{ brandCount }],
  ] = res;
  return { productCount, categoryCount, usersCount, brandCount };
}
