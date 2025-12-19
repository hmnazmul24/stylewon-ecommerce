// drizzle/schema/products.ts
import { integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { relations } from "drizzle-orm";
import { carts } from "./carts";
import { orderItems } from "./orders";
import { categoriesWithProducts } from "./categories";

export const products = pgTable("products", {
  id,
  //required
  name: text("name").notNull(),
  images: text("images").array().notNull(),
  price: numeric("price").notNull(),
  //optional
  description: text("description"),
  profit: numeric("profit"),
  margin: numeric("margin"),
  stocks: numeric("stocks"),
  costOfGoods: numeric("cost_of_goods"),
  shippingWeight: numeric("shipping_weight"),
  createdAt,
  updatedAt,
});

export const productRelations = relations(products, ({ many }) => ({
  sizes: many(productSizes),
  colors: many(productColors),
  carts: many(carts),
  orderItems: many(orderItems),
  categoriesWithProducts: many(categoriesWithProducts),
}));

export const productSizes = pgTable("product_sizes", {
  id,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
});
export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id],
  }),
}));

export const productColors = pgTable("product_colors", {
  id,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  hexColor: text("hex_color"), // optional in Zod
});

export const productColorsRelations = relations(productColors, ({ one }) => ({
  product: one(products, {
    fields: [productColors.productId],
    references: [products.id],
  }),
}));
