"use server";

import { db } from "@/drizzle/db";
import { carts, orderItems, orders, products } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PlaceOrderInterface {
  deliveryArea: string;
  deliveryAmount: number;
  paymentMethod: string;
  totalAmount: number;
}
//------------------------- place order ----------------------//
export async function placeOrder(info: PlaceOrderInterface) {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }

  console.log(info);

  //................new order .............
  const [newOrder] = await db
    .insert(orders)
    .values({
      deleveryAmount: info.deliveryAmount.toString(),
      deleveryArea: info.deliveryArea,
      paymentMethod: info.paymentMethod,
      totalAmount: info.totalAmount,
      userId: account.user.id,
      status: "pending",
    })
    .returning();

  //............getting cartInfo .............
  const cartsInfo = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, account.user.id));

  //.............maping data for insert...........
  const insertData: (typeof orderItems.$inferInsert)[] = cartsInfo.map((c) => ({
    ...c,
    orderId: newOrder.id,
  }));

  //...........inserting and deleting cart........
  await db.insert(orderItems).values([...insertData]);
  await db.delete(carts).where(eq(carts.userId, account.user.id));
  //.........update quantity of the product..............//
  const buyingProducts = await db
    .select()
    .from(products)
    .where(or(...cartsInfo.map((c) => eq(products.id, c.productId))));
  buyingProducts.forEach(async (pro) => {
    const newStock = cartsInfo.find((c) => c.productId === pro.id)?.quantity!;
    await db
      .update(products)
      .set({ stocks: String(Number(pro.stocks) - newStock) })
      .where(eq(products.id, pro.id));
  });

  return { message: "success" };
}
