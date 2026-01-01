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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Cross, Delete, Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { addBrand, deleteBrand } from "../actions";
import { productBrands } from "../queries";
import {
  AddBrandchemaType,
  addBrandSchema,
  AddProductSchemaType,
} from "../schemas";
import { ButtonWithLoading } from "@/components/shared/button-with-loading";
export function AddProductBrand({
  addProductForm,
}: {
  addProductForm: UseFormReturn<AddProductSchemaType>;
}) {
  const [open, setOpen] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ["add-product-brands"],
    queryFn: () => productBrands(),
  });

  const brand = addProductForm.watch("brand");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Brand</CardTitle>
        <CardDescription>
          Add brand name if this product comes form a brand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {brand ? (
          <div className="flex items-center justify-between gap-2">
            <span>{brand}</span>{" "}
            <Button
              type="button"
              onClick={() => addProductForm.setValue("brand", "")}
              variant={"ghost"}
            >
              <X />
            </Button>
          </div>
        ) : (
          <FieldGroup className="items-start">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="rounded-full">
                  <Plus /> Add Brand
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[400px]">
                <DialogHeader>
                  <DialogTitle>Select product Brand</DialogTitle>
                </DialogHeader>
                <div className="h-[330px] overflow-y-auto">
                  {isPending ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} />
                    ))
                  ) : error ? (
                    <div>Error</div>
                  ) : data.length === 0 ? (
                    <div>No Brands</div>
                  ) : (
                    data.map((brand) => (
                      <ListingAndDeleteBrand
                        addProductForm={addProductForm}
                        key={brand.id}
                        info={brand}
                        onClose={() => setOpen(false)}
                      />
                    ))
                  )}
                  <AddBrand />
                </div>
              </DialogContent>
            </Dialog>
          </FieldGroup>
        )}
      </CardContent>
    </Card>
  );
}

function AddBrand() {
  const qc = getQueryClient();
  const addMutation = useMutation({
    mutationFn: addBrand,
    onSuccess: async (res) => {
      if (res.error) return toast.error(res.error);
      if (res.message) {
        toast.error(res.message);
        form.reset();
        await qc.invalidateQueries({ queryKey: ["add-product-brands"] });
      }
    },
  });
  const form = useForm<AddBrandchemaType>({
    resolver: zodResolver(addBrandSchema),
    defaultValues: {
      brandName: "",
    },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="bg-background absolute right-0 bottom-0 left-0 p-4 px-6"
    >
      <Controller
        name="brandName"
        control={form.control}
        render={({ field: { ...field }, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Brand Name</FieldLabel>
            <div className="flex items-center gap-1">
              <Input type="text" aria-invalid={fieldState.invalid} {...field} />
              <ButtonWithLoading
                isPending={addMutation.isPending}
                type="button"
                onClick={form.handleSubmit((v) => addMutation.mutate(v))}
              >
                Submit
              </ButtonWithLoading>
            </div>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : (
              <span className="block h-5"></span>
            )}
          </Field>
        )}
      />
    </form>
  );
}

function ListingAndDeleteBrand({
  info,
  addProductForm,
  onClose,
}: {
  info: Awaited<ReturnType<typeof productBrands>>[number];
  addProductForm: UseFormReturn<AddProductSchemaType>;
  onClose: () => void;
}) {
  const qc = getQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: async (res) => {
      if (res.message) {
        toast.error(res.message);
        await qc.invalidateQueries({ queryKey: ["add-product-brands"] });
      }
    },
  });
  return (
    <div
      key={info.id}
      onClick={() => {
        addProductForm.setValue("brand", info.brandName);
        onClose();
      }}
      className="hover:bg-accent flex items-center justify-between gap-2"
    >
      <span className="truncate">{info.brandName}</span>
      <ButtonWithLoading
        isPending={deleteMutation.isPending}
        variant={"ghost"}
        onClick={() => deleteMutation.mutate(info.id)}
      >
        <Delete />
      </ButtonWithLoading>
    </div>
  );
}
