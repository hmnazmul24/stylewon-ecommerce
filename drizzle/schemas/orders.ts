import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./auth";
import { products } from "./products";

export const orders = pgTable("orders", {
  id,
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  paymentMethod: text("payment_method").notNull(),
  deleveryArea: text("delevery_area").notNull(),
  deleveryAmount: text("delevery_amount").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 })
    .notNull()
    .$default(() => "pending"), // pending | paid | shipped | cancelled
  createdAt,
  updatedAt,
});

export const orderItems = pgTable("order_items", {
  id,
  name: text("name").notNull(),
  orderId: uuid("order_id")
    .references(() => orders.id)
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

export const ordersRelations = relations(orders, ({ many, one }) => ({
  orderItems: many(orderItems),
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
