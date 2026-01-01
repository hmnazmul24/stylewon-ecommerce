"use server";

import { db } from "@/drizzle/db";
import {
  brands,
  productColors,
  products,
  productSizes,
} from "@/drizzle/schema";
import {
  AddBrandchemaType,
  addBrandSchema,
  addProductSchema,
  AddProductSchemaType,
} from "./schemas";
import { eq } from "drizzle-orm";

export async function addProduct(info: AddProductSchemaType) {
  const { success } = addProductSchema.safeParse(info);
  if (!success) {
    return { error: "invalid data" };
  }
  //insert product
  const [res] = await db
    .insert(products)
    .values({
      ...info,

      costOfGoods: info.costOfGoods || "0",
      shippingWeight: info.shippingWeight || "0",
      stocks: info.stocks || "0",
    })
    .returning();
  // insert sizes
  if (info.sizes.length) {
    const editedSizes = info.sizes.map((s) => ({ ...s, productId: res.id }));
    await db.insert(productSizes).values(editedSizes);
  }
  // insert colores
  if (info.colors.length) {
    const editedColors = info.colors.map((s) => ({ ...s, productId: res.id }));
    await db.insert(productColors).values(editedColors);
  }
  return { message: "New product added" };
}

//...................................................................
export async function updateProduct({
  info,
  productId,
}: {
  info: AddProductSchemaType;
  productId: string;
}) {
  const { success } = addProductSchema.safeParse(info);
  if (!success) {
    return { error: "invalid data" };
  }
  //insert product
  await db
    .update(products)
    .set({
      ...info,
      costOfGoods: info.costOfGoods || "0",
      shippingWeight: info.shippingWeight || "0",
      stocks: info.stocks || "0",
    })
    .where(eq(products.id, productId));
  // insert sizes and update sizes.......
  if (info.sizes.length) {
    const existedSizes = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.productId, productId));
    /// if exist delete
    const deleteListsPromise = existedSizes
      .filter((d) => info.sizes.some((e) => e.value === d.value))
      .map((del) => db.delete(productSizes).where(eq(productSizes.id, del.id)));
    if (deleteListsPromise.length) {
      await Promise.all(deleteListsPromise);
    }
    // if new so add
    const newLists = info.sizes
      .filter((n) => existedSizes.some((e) => e.value === n.value))
      .map((ne) => ({ ...ne, productId }));
    await db.insert(productSizes).values(newLists);
  }
  // insert colors and update colors.......
  if (info.sizes.length) {
    const existedColors = await db
      .select()
      .from(productColors)
      .where(eq(productColors.productId, productId));
    /// if exist delete
    const deleteListsPromise = existedColors
      .filter((d) => info.colors.some((e) => e.value === d.value))
      .map((del) =>
        db.delete(productColors).where(eq(productColors.id, del.id)),
      );
    if (deleteListsPromise.length) {
      await Promise.all(deleteListsPromise);
    }
    // if new so add
    const newLists = info.colors
      .filter((n) => existedColors.some((e) => e.value === n.value))
      .map((ne) => ({ ...ne, productId }));
    await db.insert(productColors).values(newLists);
  }

  return { message: "Product updated" };
}

//...................................................................
export async function deleteProduct({ productId }: { productId: string }) {
  await db.delete(products).where(eq(products.id, productId));
  await db.delete(productSizes).where(eq(productSizes.productId, productId));
  await db.delete(productColors).where(eq(productColors.productId, productId));
  return { message: "Product Deleted" };
}

//-----------------------------------brands--------------------------//

export async function addBrand(input: AddBrandchemaType) {
  const [exist] = await db
    .select()
    .from(brands)
    .where(eq(brands.brandName, input.brandName));
  if (exist) {
    return { error: "This name already exists" };
  }
  await db.insert(brands).values(input);
  return { message: "New brand added" };
}

//-----------------------------------brands--------------------------//

export async function deleteBrand(brandId: string) {
  await db.delete(brands).where(eq(brands.id, brandId));
  return { message: "Brand Deleted" };
}
