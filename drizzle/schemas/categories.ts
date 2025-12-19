import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { products } from "./products";

export const categories = pgTable("categories", {
  id,
  categoryName: text("category_name").notNull().unique(),
  createdAt,
  updatedAt,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  categoriesWithProducts: many(categoriesWithProducts),
}));

export const categoriesWithProducts = pgTable(
  "categories_with_products",
  {
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
  },
  (t) => [primaryKey({ columns: [t.categoryId, t.productId] })],
);

export const categoriesWithProductsRelations = relations(
  categoriesWithProducts,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoriesWithProducts.categoryId],
      references: [categories.id],
    }),
    product: one(products, {
      fields: [categoriesWithProducts.productId],
      references: [products.id],
    }),
  }),
);
