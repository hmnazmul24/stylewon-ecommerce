"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { getAdminProducts, soldProduct } from "../product.actions";
import { SelectProductCard } from "./select-product-card";
import { SelectProductSearchDialog } from "./select-product-search-dialog";
import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import { toast } from "sonner";
import { getQueryClient } from "@/tanstack-query/get-query-client";

export type ProductDynamicInfoType = {
  name: string;
  p_id: string;
  qty: number;
  price: number;
  size?: string;
  color?: string;
  imgUrl?: string;
};

export function SelectProducts() {
  const qc = getQueryClient();
  // for url state manage
  const [productIds, setProductIds] = useQueryState(
    "productids",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [userId] = useQueryState("customer_id");
  // quantity
  const [productDynamicInfos, setProductDynamicInfos] = useState<
    ProductDynamicInfoType[]
  >([]);
  // query the data.
  const { data, isPending, error } = useQuery({
    queryKey: ["admin-customer-products", productIds],
    queryFn: async () => {
      const res = await getAdminProducts(productIds);
      if (res.length) {
        const newValues: ProductDynamicInfoType[] = [];
        res.forEach((product) => {
          newValues.push({
            name: product.name,
            p_id: product.id,
            qty: 1,
            price: Number(product.price),
            imgUrl: product.images[0],
          });
        });
        setProductDynamicInfos(newValues);
      }
      return res;
    },
  });

  const addProductId = (id: string) => {
    if (!productIds.includes(id)) {
      setProductIds([...productIds, id]);
    }
  };

  const removeProductById = (id: string) => {
    const nextIds = productIds.filter((p) => p !== id);
    setProductIds(nextIds.length > 0 ? nextIds : null);
  };

  // for proceed and successfull payment
  const soldMutation = useMutation({
    mutationFn: soldProduct,
    onSuccess: ({ message }) => {
      if (message) {
        toast.success(message);
        setProductDynamicInfos([]);
        setProductIds([]);
        qc.invalidateQueries({ queryKey: ["admin-order-listings"] });
      }
    },
  });

  if (isPending) {
    return <SelectedProductsSkeleton />;
  }
  if (error) {
    return <div>Error</div>;
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Selected Products</CardTitle>
        </CardHeader>
        <CardContent>
          {data && data.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center">
              No product is selected !
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((product) => (
                <SelectProductCard
                  key={product.id}
                  product={product}
                  productDynamicInfo={
                    productDynamicInfos.find((p) => p.p_id === product.id)!
                  }
                  setProductDynamicInfo={(id, info) => {
                    const updatedData = productDynamicInfos.map((p) =>
                      p.p_id === id ? info : p,
                    );
                    setProductDynamicInfos(updatedData);
                  }}
                  remove={removeProductById}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <SelectProductSearchDialog
            productIds={productIds}
            setProductIds={(id) =>
              productIds.includes(id) ? removeProductById(id) : addProductId(id)
            }
          >
            <Button>
              Add Product <Plus />
            </Button>
          </SelectProductSearchDialog>
        </CardFooter>
      </Card>
      <div className="bg-card flex items-center justify-between rounded-lg border p-6">
        <span className="text-base font-semibold md:text-xl">
          Total Amount :{" "}
          {productDynamicInfos.reduce(
            (prev, curr) => curr.qty * curr.price + prev,
            0,
          )}{" "}
          &#2547;
        </span>
        <ButtonWithLoading
          isPending={soldMutation.isPending}
          onClick={() => {
            if (!userId) {
              return toast.info("Please Select a user first");
            }
            soldMutation.mutate({ info: productDynamicInfos, userId });
          }}
        >
          Proceed
        </ButtonWithLoading>
      </div>
    </div>
  );
}

function SelectedProductsSkeleton() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Selected Products</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border p-4"
          >
            <Skeleton className="h-16 w-16 rounded-lg" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-8 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
