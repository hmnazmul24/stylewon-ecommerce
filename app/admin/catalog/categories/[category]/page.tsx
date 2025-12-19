import CategoryProductListingPage from "@/features/admin/catalog/categories/pages/category-product-listing-page";
import React from "react";

export default async function page(
  props: PageProps<"/admin/catalog/categories/[category]">,
) {
  const params = await props.params;
  return (
    <div>
      <CategoryProductListingPage categoryId={params.category} />
    </div>
  );
}
