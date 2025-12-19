import { pgTable, uuid, integer, varchar, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./auth";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const carts = pgTable("carts", {
  id,
  name: text("name").notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  size: varchar("size"),
  color: varchar("color"),
  imageUrl: text("image_url"),
  createdAt,
  updatedAt,
});

export const cartsRelations = relations(carts, ({ one }) => ({
  product: one(products, {
    fields: [carts.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
}));
