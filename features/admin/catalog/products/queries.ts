"use server";

import { db } from "@/drizzle/db";
import {
  brands,
  categories,
  productColors,
  products,
  productSizes,
} from "@/drizzle/schema";
import { AddProductSchemaType } from "./schemas";
import { eq } from "drizzle-orm";

export async function getProducts() {
  return await db.query.products.findMany({
    with: { colors: true, sizes: true },
  });
}

export async function productCategories() {
  return await db.select().from(categories);
}
export async function productBrands() {
  return await db.select().from(brands);
}

///.........................................................................

export async function getProductWithDetails(productId: string) {
  const [productResult] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));
  const sizeResults = await db
    .select()
    .from(productSizes)
    .where(eq(productSizes.id, productId));
  const colorsResults = await db
    .select()
    .from(productColors)
    .where(eq(productColors.productId, productId));

  const productData: AddProductSchemaType = {
    ...productResult,
    profit: productResult.profit ?? "",
    margin: productResult.margin ?? "",
    costOfGoods: productResult.costOfGoods ?? "",
    shippingWeight: productResult.shippingWeight ?? "",
    stocks: productResult.stocks ?? "",
    price: productResult.price ?? "",
    description: productResult.description ?? "",
    sizes: sizeResults,
    colors: colorsResults.map((c) => ({
      ...c,
      hexColor: c.hexColor ?? undefined,
    })),
  };

  return productData;
}
