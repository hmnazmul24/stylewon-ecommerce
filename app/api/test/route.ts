import { db } from "@/drizzle/db";
import { categoriesWithProducts, products } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const data = await db
    .insert(products)
    .values({ name: "product_name", images: ["safdas"], price: "100" });

  return NextResponse.json({ success: "new product added", data });
}
