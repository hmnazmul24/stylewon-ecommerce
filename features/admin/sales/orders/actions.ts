"use server";

import { db } from "@/drizzle/db";
import { orderItems, orders } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

export async function changeOrderStatus({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  updateTag("adminOrders");
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function getOrdersItems({ orderId }: { orderId: string }) {
  const allOrderItems = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, orderId),
  });
  return allOrderItems;
}
