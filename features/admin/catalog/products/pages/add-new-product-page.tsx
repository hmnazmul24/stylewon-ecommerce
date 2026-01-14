"use client";

import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addProduct } from "../actions";
import AddProdutActionBtns from "../components/add-product-action-btns";
import AddProductBasicInfo from "../components/add-product-basic-info";
import AddProductImage from "../components/add-product-images";
import AddProductOptions from "../components/add-product-options";
import AddProductPricing from "../components/add-product-pricing";
import AddProductStockAndShipping from "../components/add-product-stock-shipping";
import { addProductSchema, AddProductSchemaType } from "../schemas";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { AddProductCateogry } from "../components/add-product-category";
import { AddProductBrand } from "../components/add-product-brand";

export default function AddNewProductPage() {
  const qc = getQueryClient();
  const form = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      costOfGoods: "",
      brand: "",
      price: "",
      images: [],
      margin: "",
      profit: "",
      shippingWeight: "",
      stocks: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addProduct,
    onSuccess: ({ message }) => {
      toast.success(message);
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["marketing-products"],
      });
      qc.invalidateQueries({
        queryKey: ["marketing-product-details"],
      });

      // emptying some fields
      form.setValue("name", "");
      form.setValue("images", []);
      form.setValue("price", "");
      form.setValue("stocks", "");
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((v) => mutate(v))}
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
