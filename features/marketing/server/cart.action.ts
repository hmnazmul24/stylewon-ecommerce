"use server";

import { db } from "@/drizzle/db";
import { carts } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

//-------------------------cart items-------------------//
export async function getCartItems({ userId }: { userId: string | undefined }) {
  if (!userId) return;
  const allCarts = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId));
  return allCarts;
}

//-----------------------add to cart-------------------//
export async function addToCart(
  inputs: Omit<typeof carts.$inferInsert, "userId">,
) {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }
  const whereEqality = and(
    eq(carts.productId, inputs.productId),
    eq(carts.userId, account.user.id),
  );

  const [isCartExisted] = await db.select().from(carts).where(whereEqality);
  if (isCartExisted) {
    if (inputs.quantity === isCartExisted.quantity) {
      return { info: "This item already added to cart" };
    }

    //...............if exist so update................
    await db
      .update(carts)
      .set({ quantity: inputs.quantity })
      .where(whereEqality);
    return { message: "Quantity updated" };
  }

  //............otherwise insert new..................
  await db.insert(carts).values({ ...inputs, userId: account.user.id });
  return { message: "Product added to cart" };
}

//

export async function cartActions({
  cartId,
  type,
}: {
  type: "REMOVE_FROM_CART" | "INCREASE_QUANTITY" | "DECREASE_QUANTITY";
  cartId: string;
}) {
  const account = await auth.api.getSession({ headers: await headers() });
  if (!account) {
    redirect("/");
  }
  const whereEqual = and(
    eq(carts.userId, account.user.id),
    eq(carts.id, cartId),
  );

  const [cart] = await db.select().from(carts).where(whereEqual);
  if (!cart) {
    return { info: "No cart!" };
  }

  if (type === "REMOVE_FROM_CART") {
    await db.delete(carts).where(whereEqual);
  }
  if (type === "INCREASE_QUANTITY") {
    await db
      .update(carts)
      .set({ quantity: cart.quantity + 1 })
      .where(whereEqual);
  }
  if (type === "DECREASE_QUANTITY") {
    await db
      .update(carts)
      .set({ quantity: cart.quantity > 1 ? cart.quantity - 1 : cart.quantity })
      .where(whereEqual);
  }
}
