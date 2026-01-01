import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";

export const brands = pgTable("brands", {
  id,
  brandName: varchar("brand_name").notNull().unique(),
  createdAt,
  updatedAt,
});
