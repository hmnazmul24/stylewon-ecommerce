"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import { Delete, Plus } from "lucide-react";
import { useState } from "react";
import { productCategories } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategorySelection } from "../hooks/use-add-product";
export function AddProductCateogry() {
  const { checkedCategoryIds, setCheckedCategoryIds } = useCategorySelection();
  const [open, setOpen] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ["add-product-categories"],
    queryFn: () => productCategories(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Category</CardTitle>
        <CardDescription>
          Add into diffrent cateogry of this product for better filtering
        </CardDescription>
      </CardHeader>
      <CardContent>
        {checkedCategoryIds.length !== 0 && (
          <div className="py-4">
            {data
              ?.filter((item) => checkedCategoryIds.includes(item.id))
              .map((c, i) => (
                <div
                  key={c.id}
                  className="flex w-full items-center justify-between p-2"
                >
                  <span>
                    {i + 1}. {c.categoryName}
                  </span>
                  <Delete onClick={() => setCheckedCategoryIds(c.id)} />
                </div>
              ))}
          </div>
        )}

        <FieldGroup className="items-start">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="rounded-full">
                <Plus /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[400px]">
              <DialogHeader>
                <DialogTitle>Select product categories</DialogTitle>
                <div className="h-[330px] overflow-y-auto">
                  {isPending ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} />
                    ))
                  ) : error ? (
                    <div>Error</div>
                  ) : data.length === 0 ? (
                    <div>No categories</div>
                  ) : (
                    data.map((cat) => (
                      <div
                        onClick={() => setCheckedCategoryIds(cat.id)}
                        key={cat.id}
                        className="hover:bg-accent flex w-full cursor-pointer items-center justify-start gap-2 rounded-md p-2"
                      >
                        <Checkbox
                          checked={checkedCategoryIds.includes(cat.id)}
                        />
                        <span>{cat.categoryName}</span>
                      </div>
                    ))
                  )}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
