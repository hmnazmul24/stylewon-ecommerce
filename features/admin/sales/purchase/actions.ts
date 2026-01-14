"use server";

import { auth } from "@/lib/auth";
import { NewUserSchemaType } from "./components/add-new-customer";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { user } from "@/auth-schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import {
  billingInfo,
  carts,
  orderItems,
  orders,
  products,
} from "@/drizzle/schema";
import { redirect } from "next/navigation";

export async function createAdminUser(inputs: NewUserSchemaType) {
  const [existPhoneNumber] = await db
    .select({ phoneNo: user.phoneNumber })
    .from(user)
    .where(eq(user.phoneNumber, inputs.phoneNo));
  if (existPhoneNumber) {
    return { error: "Phone number already exist" };
  }
  console.log(inputs, existPhoneNumber);
  // create user
  const res = await auth.api.createUser({
    body: {
      name: inputs.name,
      email: inputs.email || `${inputs.phoneNo}@my-site.com`,
      password: inputs.phoneNo,
      role: "user",
    },
    headers: await headers(),
  });
  // update phonenumber within that
  await db
    .update(user)
    .set({ phoneNumber: inputs.phoneNo })
    .where(eq(user.id, res.user.id));

  // update user address
  const default_district_id = "56";
  const default_upazila_id = "279";

  if (inputs.address) {
    await db.insert(billingInfo).values({
      address: inputs.address,
      districtId: default_district_id,
      upazilaId: default_upazila_id,
      fullName: res.user.name,
      phone: inputs.phoneNo,
      email: res.user.email,
      userId: res.user.id,
    });
  }
  return { message: "New user registered", customerId: res.user.id };
}

//-----------------------------search user--------------------------------//
export async function searchAdminUser(query: string) {
  const data = await db
    .select()
    .from(user)
    .where(ilike(user.phoneNumber, `%${query}%`))
    .limit(10);
  return data;
}
//-----------------------------slected user--------------------------------//
export async function selectedAdminUser(userId: string) {
  const [res] = await db.select().from(user).where(eq(user.id, userId));
  return res;
}

//------------------- search any products ------------------//
export async function searchAnyProducts({
  search,
  page,
}: {
  search: string;
  page: number;
}) {
  const limit = 10;
  const offset = (page - 1) * limit;

  const data = await db.query.products.findMany({
    where: ilike(products.name, search ? `%${search}%` : "%"),
    columns: { id: true, name: true, images: true },
    limit,
    offset,
  });
  return { products: data, nextPage: data.length === limit ? page + 1 : null };
}

// ------------------------ adding or unadding to cart -------------------//

export async function isQuantityAvailable({
  productId,
  qty,
}: {
  productId: string;
  qty: number;
}): Promise<boolean> {
  const [{ stock }] = await db
    .select({
      stock: products.stocks,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (stock) {
    return Number(stock) >= qty;
  } else {
    return false;
  }
}

//-----------------------------------order listings -----------------------------//
export async function getOrdersById(userId: string) {
  const orderInfo = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { orderItems: true },
    orderBy: desc(orders.createdAt),
  });
  return orderInfo;
}

//---------------------cancel order------------------------//
export async function cancelOrderById({ orderId }: { orderId: string }) {
  await db
    .update(orders)
    .set({ status: "canceled" })
    .where(eq(orders.id, orderId));
  return { message: "Order Cancelled" };
}
