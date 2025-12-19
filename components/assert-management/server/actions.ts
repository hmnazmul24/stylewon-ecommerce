"use server";

import { db } from "@/drizzle/db";
import { assertFolders, asserts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { deleteFromCloude, uploadToCloude } from "./helpers";

export async function uploadAssert({
  formData,
  folderId,
}: {
  formData: FormData;
  folderId: string;
}) {
  const imageFile = formData.get("imageFile") as File;
  const res = await uploadToCloude(imageFile);
  await db.insert(asserts).values({ ...res, folderId });
}
export async function deleteAssert(publicId: string) {
  await deleteFromCloude(publicId);
  await db.delete(asserts).where(eq(asserts.publicId, publicId));
}

export async function createFolder(folderName: string) {
  const [isExist] = await db
    .select()
    .from(assertFolders)
    .where(eq(assertFolders.folderName, folderName));
  if (!isExist) {
    await db.insert(assertFolders).values({ folderName });
  }
}
export async function updateFolderName({
  folderId,
  folderName,
}: {
  folderId: string;
  folderName: string;
}) {
  const [isExist] = await db
    .select()
    .from(assertFolders)
    .where(eq(assertFolders.folderName, folderName));
  if (!isExist) {
    await db
      .update(assertFolders)
      .set({ folderName })
      .where(eq(assertFolders.id, folderId));
  }
}
export async function deleteFolder(folderId: string) {
  const existedAsserts = await db
    .select()
    .from(asserts)
    .where(eq(asserts.folderId, folderId));
  if (existedAsserts.length !== 0) {
    return {
      error: "Before deleting folder, you must delete all existing asserts",
    };
  }

  await db.delete(assertFolders).where(eq(assertFolders.id, folderId));
  return { error: null };
}
