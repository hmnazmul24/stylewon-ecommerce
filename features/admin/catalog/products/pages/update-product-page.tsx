"use client";

import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { useQuery } from "@tanstack/react-query";
import { UpdateProductForm } from "../components/update-product-form";
import { getProductWithDetails } from "../queries";

export default function UpdateProudctPage({
  productId,
}: {
  productId: string;
}) {
  const { isPending, error, data } = useQuery({
    queryKey: ["single-product", productId],
    queryFn: () => getProductWithDetails(productId),
  });
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }
  if (!data) {
    return <h3>No data Exists</h3>;
  }

  return (
    <div>
      <UpdateProductForm info={data} productId={productId} />
    </div>
  );
}
