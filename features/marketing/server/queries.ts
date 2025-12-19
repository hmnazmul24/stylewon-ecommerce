"use server";

import { db } from "@/drizzle/db";
import { categories, categoriesWithProducts, products } from "@/drizzle/schema";
import { and, eq, exists, ilike, inArray, or } from "drizzle-orm";
import { redirect } from "next/navigation";

//-------------------------Marketing products ------------------------//
export async function getMarketingProducts() {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.categoryName, "Home"));
  const res = await db.query.categoriesWithProducts.findMany({
    where: eq(categoriesWithProducts.categoryId, category.id),
    with: { product: true },
  });
  return res;
}

//---------------------products with search functionality-------------//

export async function productsWithSearches({
  search,
  page,
  category,
}: {
  search: string;
  page: number;
  category: string[];
}) {
  const limit = 8;
  const offset = (page - 1) * limit;

  const whereConditions = [];

  // 🔍 search
  if (search) {
    whereConditions.push(ilike(products.name, `%${search}%`));
  }

  // 🏷️ category filter (many-to-many)
  if (category.length > 0) {
    const selectedCategory = (
      await db
        .select()
        .from(categories)
        .where(or(...category.map((c) => eq(categories.categoryName, c))))
    ).map((s) => s.id);
    whereConditions.push(
      exists(
        db
          .select()
          .from(categoriesWithProducts)
          .where(
            and(
              eq(categoriesWithProducts.productId, products.id),
              inArray(categoriesWithProducts.categoryId, selectedCategory),
            ),
          ),
      ),
    );
  }

  const data = await db.query.products.findMany({
    where: and(...whereConditions),
    limit,
    offset,
  });

  return {
    products: data,
    nextPage: data.length === limit ? page + 1 : null,
  };
}

//------------------------get product details --------------------//
export async function productDetails(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { sizes: true, colors: true },
  });

  if (!product) {
    redirect("/");
  }
  return product;
}

//-------------------------get all categories------------------------//
export async function getCategories() {
  const cat = await db.select().from(categories);
  const filteredCat = cat.filter((c) => c.categoryName !== "Home");
  return filteredCat;
}

//-------------------------get all categories------------------------//
export async function getRelatedProducts(productId: string) {
  const existed = await db.query.categoriesWithProducts.findFirst({
    where: eq(categoriesWithProducts.productId, productId),
  });

  let relatedProducts: (typeof products.$inferSelect)[] = [];
  if (existed) {
    const res = await db.query.categoriesWithProducts.findMany({
      where: eq(categoriesWithProducts.categoryId, existed.categoryId),
      with: { product: true },
    });
    relatedProducts = res.map((r) => r.product);
  }
  return relatedProducts;
}
