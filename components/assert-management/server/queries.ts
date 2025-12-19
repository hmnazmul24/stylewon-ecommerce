"use server";

import { db } from "@/drizzle/db";
import { assertFolders, asserts } from "@/drizzle/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function getAsserts({ folderId }: { folderId: string }) {
  return await db.select().from(asserts).where(eq(asserts.folderId, folderId));
}

export async function getFolders() {
  return await db
    .select()
    .from(assertFolders)
    .orderBy(asc(assertFolders.folderName));
}
