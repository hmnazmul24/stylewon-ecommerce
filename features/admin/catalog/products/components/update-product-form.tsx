"use client";

import { FieldGroup } from "@/components/ui/field";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProduct } from "../actions";
import { addProductSchema, AddProductSchemaType } from "../schemas";
import AddProdutActionBtns from "./add-product-action-btns";
import AddProductBasicInfo from "./add-product-basic-info";
import { AddProductCateogry } from "./add-product-category";
import AddProductImage from "./add-product-images";
import AddProductOptions from "./add-product-options";
import AddProductPricing from "./add-product-pricing";
import AddProductStockAndShipping from "./add-product-stock-shipping";
import { useRouter } from "next/navigation";
import { AddProductBrand } from "./add-product-brand";

export function UpdateProductForm({
  info,
  productId,
}: {
  info: AddProductSchemaType;
  productId: string;
}) {
  const router = useRouter();
  const qc = getQueryClient();
  const form = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      ...info,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProduct,
    onSuccess: async ({ message }) => {
      toast.success(message);

      await qc.invalidateQueries({ queryKey: ["single-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["marketing-products"],
      });
      qc.invalidateQueries({
        queryKey: ["marketing-product-details"],
      });
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((v) => mutate({ info: v, productId }))}
      className="grid grid-cols-1 space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0"
    >
      <FieldGroup>
        <AddProductImage form={form} />
        <AddProductBasicInfo form={form} />
        <AddProductPricing form={form} />
      </FieldGroup>
      <FieldGroup>
        <AddProductOptions form={form} />
        <AddProductBrand addProductForm={form} />
        <AddProductCateogry />
        <AddProductStockAndShipping form={form} />
        <AddProdutActionBtns isPending={isPending} form={form} />
      </FieldGroup>
    </form>
  );
}
