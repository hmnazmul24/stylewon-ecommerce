import ProductDetailsPage from "@/features/marketing/pages/product-details-page";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return <ProductDetailsPage slug={slug} />;
}
