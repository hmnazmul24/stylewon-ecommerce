"use cache";

import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { cacheLife, cacheTag } from "next/cache";

export async function getOrders() {
  cacheTag("adminOrders");
  cacheLife("seconds");
  const allOrders = await db.select().from(orders);
  return allOrders;
}
