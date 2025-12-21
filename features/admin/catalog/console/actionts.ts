"use server";

import { db } from "@/drizzle/db";
import { banners, defaultDeliveryCharge } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getDeliverCharge() {
  const [res] = await db.select().from(defaultDeliveryCharge);
  return res;
}
export async function updateDeliverCharge({
  insideDhaka,
  outsideDhaka,
}: {
  insideDhaka: string;
  outsideDhaka: string;
}) {
  const [res] = await db.select().from(defaultDeliveryCharge);
  if (res) {
    await db.update(defaultDeliveryCharge).set({
      insideDhaka: Number(insideDhaka),
      outsideDhaka: Number(outsideDhaka),
    });
  } else {
    await db.insert(defaultDeliveryCharge).values({
      insideDhaka: Number(insideDhaka),
      outsideDhaka: Number(outsideDhaka),
    });
  }
}

//======================== banner ===============================//

export async function uploadBanner(
  info: { imageUrl: string; redirectTo: string }[],
) {
  await db.insert(banners).values(info);
  return { message: "Banner uploaded" };
}
export async function getBanner() {
  const res = await db.select().from(banners);
  return res;
}
export async function deleteBanner(bannerId: string) {
  await db.delete(banners).where(eq(banners.id, bannerId));
}
