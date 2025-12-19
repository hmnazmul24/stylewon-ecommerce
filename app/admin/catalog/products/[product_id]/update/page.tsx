import UpdateProudctPage from "@/features/admin/catalog/products/pages/update-product-page";

export default async function page(
  props: PageProps<"/admin/catalog/products/[product_id]/update">,
) {
  const prouductId = (await props.params).product_id;
  return <UpdateProudctPage productId={prouductId} />;
}
