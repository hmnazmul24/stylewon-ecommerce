import { carts } from "@/drizzle/schema";

export type CartType = Pick<
  typeof carts.$inferInsert,
  | "id"
  | "price"
  | "productId"
  | "color"
  | "quantity"
  | "size"
  | "imageUrl"
  | "name"
>;
