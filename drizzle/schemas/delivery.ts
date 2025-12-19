import { integer, pgTable } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";

export const defaultDeliveryCharge = pgTable("default_delivery_charge", {
  id,
  insideDhaka: integer("inside_dhaka").notNull(),
  outsideDhaka: integer("outside_dhaka").notNull(),
  createdAt,
  updatedAt,
});
