"use server";

import { db } from "@/drizzle/db";
import { categories, categoriesWithProducts, products } from "@/drizzle/schema";
import { count, eq, ilike, sql } from "drizzle-orm";

export async function getCategoreis() {
  const data = await db
    .select({
      id: categories.id,
      categoryName: categories.categoryName,
      productCount: count(categoriesWithProducts.productId),
    })
    .from(categories)
    .leftJoin(
      categoriesWithProducts,
      eq(categories.id, categoriesWithProducts.categoryId),
    )
    .groupBy(categories.id);
  return data;
}
export async function singleCategroyWithProducts({
  categoryId,
}: {
  categoryId: string;
}) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));
  const categoryWithProduts = await db.query.categoriesWithProducts.findMany({
    where: eq(categoriesWithProducts.categoryId, categoryId),
    with: {
      product: { columns: { name: true, id: true, images: true } },
    },
  });
  return { category, categoryWithProduts };
}

export async function searchCategoryProducts({
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
