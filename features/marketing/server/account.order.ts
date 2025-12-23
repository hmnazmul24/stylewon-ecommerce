"use server";

import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
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
    orderBy: desc(orders.createdAt),
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

export async function getDashboardData() {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }

  const allOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, account.user.id))
    .orderBy(desc(orders.createdAt));
  const allOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter(
    (o) => o.status === "pending",
  ).length;
  const completedOrdersCount = allOrders.filter(
    (o) => o.status === "completed",
  ).length;
  const recentOrders = allOrders.slice(0, 2);
  return {
    allOrdersCount,
    pendingOrdersCount,
    completedOrdersCount,
    recentOrders,
  };
}
