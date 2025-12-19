"use server";

import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getOrders() {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }
  const orderInfo = await db.query.orders.findMany({
    where: eq(orders.userId, account.user.id),
    with: { orderItems: true },
  });
  return orderInfo;
}

//---------------------cancel order------------------------//
export async function cancelOrder({ orderId }: { orderId: string }) {
  await db
    .update(orders)
    .set({ status: "canceled" })
    .where(eq(orders.id, orderId));
  return { message: "Order Cancelled" };
}
