"use server";

import { db } from "@/drizzle/db";

export async function getInventory() {
  return await db.query.products.findMany({
    with: { colors: true, sizes: true },
  });
}
