"use server";

import { db } from "@/drizzle/db";
import { orderItems, orders, products } from "@/drizzle/schema";
import { eq, inArray, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProductDynamicInfoType } from "./components/select-products";

export async function getAdminProducts(productIds: string[]) {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const adminProducts = await db.query.products.findMany({
    where: inArray(products.id, productIds),
    with: {
      sizes: true,
      colors: true,
    },
  });

  if (adminProducts.length === 0) {
    redirect("/");
  }

  return adminProducts;
}

// ------------------------ sold product -------------------//

interface SoldOrderInterface {
  userId: string;
  info: ProductDynamicInfoType[];
}
//------------------------- place order ----------------------//
export async function soldProduct({ info, userId }: SoldOrderInterface) {
  //................new order .............
  const [newOrder] = await db
    .insert(orders)
    .values({
      deleveryAmount: "0",
      deleveryArea: "outside_dhaka",
      paymentMethod: "cod",
      totalAmount: info.reduce((prev, curr) => curr.price * curr.qty + prev, 0),
      userId,
      status: "delivered",
    })
    .returning();

  console.log(info, "server");

  //.............maping data for insert...........//
  const insertData: (typeof orderItems.$inferInsert)[] = info.map((p) => ({
    name: p.name,
    orderId: newOrder.id,
    price: p.price,
    productId: p.p_id,
    quantity: p.qty,
    color: p.color,
    size: p.size,
    imageUrl: p.imgUrl,
  }));

  //...........inserting and deleting cart........
  await db.insert(orderItems).values([...insertData]);
  //.........update quantity of the product..............//
  const buyingProducts = await db
    .select()
    .from(products)
    .where(or(...insertData.map((p) => eq(products.id, p.productId))));

  buyingProducts.forEach(async (pro) => {
    const newStock = insertData.find((c) => c.productId === pro.id)?.quantity!;
    console.log(newStock, String(Number(pro.stocks) - newStock), "server");

    await db
      .update(products)
      .set({ stocks: String(Number(pro.stocks) - newStock) })
      .where(eq(products.id, pro.id));
  });

  return { message: "success" };
}
