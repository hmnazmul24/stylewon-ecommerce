"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Layers, Plus, Save, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createCateogryWithProduct,
  deleteCateogryWithProduct,
} from "../actions";
import { singleCategroyWithProducts } from "../queries";
import { CategoryProductType } from "../types";
import { CategoryAddProductSearch } from "./category-add-product-search";

export function CaetegoryProdutListing({ categoryId }: { categoryId: string }) {
  const qc = getQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: [categoryId],
    queryFn: () => singleCategroyWithProducts({ categoryId }),
  });

  const dbProducts = data.categoryWithProduts.map((c) => c.product);

  const [products, setProducts] = useState<CategoryProductType[]>([]);

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      // ✅ SAFE DIFF BY ID
      const newAddedProducts = products.filter(
        (pro) => !dbProducts.some((db) => db.id === pro.id),
      );

      const removedProducts = dbProducts.filter(
        (pro) => !products.some((p) => p.id === pro.id),
      );

      const createPromises = newAddedProducts.map((pro) =>
        createCateogryWithProduct({ productId: pro.id, categoryId }),
      );

      const deletePromises = removedProducts.map((pro) =>
        deleteCateogryWithProduct({ productId: pro.id, categoryId }),
      );

      await Promise.all([...createPromises, ...deletePromises]);
    },

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: [categoryId],
      });
      qc.invalidateQueries({
        queryKey: ["categories", "marketing-categories"],
      });
      toast.success("Category products updated");
    },

    onError: () => {
      toast.error("Failed to update");
      setProducts(dbProducts); // ✅ rollback protection
    },
  });

  useEffect(() => {
    setProducts(dbProducts);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xl">{data.category.categoryName}</span>

        <Button onClick={() => mutate()} disabled={isPending}>
          <LoadingSwap isLoading={isPending}>
            <Save />
          </LoadingSwap>
          <span className="hidden md:block">Save</span>
        </Button>
      </div>

      <div>
        <div className="my-5 flex items-center gap-3">
          <h2 className="text-lg font-semibold">Products</h2>

          <CategoryAddProductSearch
            products={products}
            setProduct={(product) => {
              setProducts((prev) => {
                const exists = prev.some((p) => p.id === product.id);
                return exists
                  ? prev.filter((p) => p.id !== product.id)
                  : [...prev, product];
              });
            }}
          >
            <Button>
              <Plus /> Add
            </Button>
          </CategoryAddProductSearch>
        </div>

        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-3 lg:grid-cols-6 xl:grid-cols-7">
          {products.length === 0 ? (
            <div className="bg-accent flex aspect-square items-center justify-center gap-3 rounded-md p-2 text-sm">
              <Layers /> No products
            </div>
          ) : (
            products.map((pro) => (
              <div
                key={pro.id}
                className="bg-accent relative aspect-square rounded-md"
              >
                <Image
                  src={pro.images[0] ?? ""}
                  height={400}
                  width={400}
                  alt="product-img"
                  className="h-full w-full rounded-md object-cover"
                />

                <div className="to-accent absolute bottom-0 left-0 w-full truncate bg-linear-to-b from-transparent p-2 py-4 text-xs">
                  {pro.name}
                </div>

                <Button
                  onClick={() =>
                    setProducts((prev) => prev.filter((p) => p.id !== pro.id))
                  }
                  variant="secondary"
                  className="absolute top-1 right-1 z-20 rounded-full"
                >
                  <Trash />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
