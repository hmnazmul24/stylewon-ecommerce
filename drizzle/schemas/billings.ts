import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const billingInfo = pgTable("billing_info", {
  id,
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  districtId: text("district_id").notNull(),
  upazilaId: text("upazila_id").notNull(),
  address: text("address").notNull(),
  email: text("email"),
  note: text("note"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt,
  updatedAt,
});

export const billingsInfoRelations = relations(billingInfo, ({ one }) => ({
  user: one(user, { fields: [billingInfo.userId], references: [user.id] }),
}));
