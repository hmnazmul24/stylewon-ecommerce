import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { relations } from "drizzle-orm";

export const assertFolders = pgTable("assert_folders", {
  id,
  folderName: text("folder_name").notNull().unique(),
});
export const assertFoldersRelations = relations(assertFolders, ({ many }) => ({
  asserts: many(asserts),
}));

export const asserts = pgTable("asserts", {
  id,
  folderId: uuid("folder_id")
    .notNull()
    .references(() => assertFolders.id, { onDelete: "cascade" }),

  secureUrl: text("secure_url").notNull(),
  publicId: text("public_id").notNull(),
  createdAt,
  updatedAt,
});

export const assertsRelations = relations(asserts, ({ one }) => ({
  assertFolder: one(assertFolders, {
    fields: [asserts.folderId],
    references: [assertFolders.id],
  }),
}));

export const banners = pgTable("banners", {
  id,
  imageUrl: text("image_url").notNull(),
  redirectTo: text("redirect_to"),
  createdAt,
  updatedAt,
});
