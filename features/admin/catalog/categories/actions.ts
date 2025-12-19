"use server";

import { db } from "@/drizzle/db";
import { categories, categoriesWithProducts } from "@/drizzle/schema";
import { and, eq, exists } from "drizzle-orm";

export async function createCategory({
  categoryName,
}: {
  categoryName: string;
}) {
  const [isExist] = await db
    .select()
    .from(categories)
    .where(eq(categories.categoryName, categoryName));
  if (isExist) {
    return { error: "Category name is already exist, try another" };
  }
  await db.insert(categories).values({ categoryName });
}
export async function updateCategory({
  categoryId,
  categoryName,
}: {
  categoryName: string;
  categoryId: string;
}) {
  const [isExist] = await db
    .select()
    .from(categories)
    .where(eq(categories.categoryName, categoryName));
  if (isExist) {
    return { error: "Category name is already exist, try another" };
  }
  await db
    .update(categories)
    .set({ categoryName })
    .where(eq(categories.id, categoryId));
}
export async function deleteCategory({ categoryId }: { categoryId: string }) {
  await db
    .delete(categoriesWithProducts)
    .where(eq(categoriesWithProducts.categoryId, categoryId));
  await db.delete(categories).where(eq(categories.id, categoryId));
  return { message: "Category deleted successfully" };
}
export async function createCateogryWithProduct({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) {
  await db.insert(categoriesWithProducts).values({ categoryId, productId });
}
export async function deleteCateogryWithProduct({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) {
  await db
    .delete(categoriesWithProducts)
    .where(
      and(
        eq(categoriesWithProducts.categoryId, categoryId),
        eq(categoriesWithProducts.productId, productId),
      ),
    );
}
