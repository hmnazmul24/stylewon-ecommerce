"use server";

import { db } from "@/drizzle/db";
import { products } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateStock({
  productId,
  stocks,
}: {
  productId: string;
  stocks: string;
}) {
  await db.update(products).set({ stocks }).where(eq(products.id, productId));
}
