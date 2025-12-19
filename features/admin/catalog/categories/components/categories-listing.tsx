"use client";

import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, Edit, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Fragment, ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createCategory, deleteCategory, updateCategory } from "../actions";
import { getCategoreis } from "../queries";
export function CategoriesListing() {
  const { data } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoreis(),
  });
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {data.map((cat, i) => (
        <div key={cat.id} className="relative">
          <Link href={`categories/${cat.id}`}>
            <div className="from-background to-accent relative flex aspect-square items-center justify-center rounded-md bg-linear-to-r shadow">
              <div className="absolute bottom-0 flex w-full items-center justify-between p-4 text-sm">
                <span className="truncate">{cat.categoryName}</span>
                <ChevronRight />
              </div>
              <div className="text-2xl font-semibold">{cat.productCount}</div>
            </div>
          </Link>
          {cat.categoryName !== "Home" && (
            <Fragment>
              {" "}
              <DeleteCategoryDialog categoryId={cat.id}>
                <Button
                  variant={"ghost"}
                  className="absolute top-1 right-10 z-10"
                >
                  <Trash />
                </Button>
              </DeleteCategoryDialog>
              <UpdateCategoryDialog
                categoryId={cat.id}
                categoryName={cat.categoryName}
              >
                <Button
                  variant={"ghost"}
                  className="absolute top-1 right-1 z-10"
                >
                  <Edit />
                </Button>
              </UpdateCategoryDialog>
            </Fragment>
          )}
        </div>
      ))}
      <div className="from-background to-accent flex aspect-square items-center justify-center rounded-md bg-linear-to-r">
        <AddCategoryDialog>
          <Button className="h-full w-full" variant={"ghost"}>
            <Plus />
            Add new
          </Button>
        </AddCategoryDialog>
      </div>
    </div>
  );
}
const categorySchema = z.object({
  categoryName: z
    .string()
    .min(3, "Must be at least 3 char")
    .max(80, "Can not exced 80 char"),
});

function AddCategoryDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const qc = getQueryClient();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: async (info) => {
      if (info?.error) {
        return toast.error(info.error);
      }
      form.reset();
      setOpen(false);
      await qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutate(v))}>
          <FieldGroup>
            <Controller
              name="categoryName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category Name</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <ButtonWithLoading isPending={isPending}>
                Submit
              </ButtonWithLoading>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateCategoryDialog({
  children,
  categoryId,
  categoryName,
}: {
  children: ReactNode;
  categoryId: string;
  categoryName: string;
}) {
  const [open, setOpen] = useState(false);
  const qc = getQueryClient();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (info) => {
      if (info?.error) {
        return toast.error(info.error);
      }
      form.reset();
      setOpen(false);
      await qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update new category</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutate({ ...v, categoryId }))}>
          <FieldGroup>
            <Controller
              name="categoryName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category Name</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <ButtonWithLoading isPending={isPending}>
                Submit
              </ButtonWithLoading>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCategoryDialog({
  children,
  categoryId,
}: {
  children: ReactNode;
  categoryId: string;
}) {
  const [open, setOpen] = useState(false);
  const qc = getQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async (info) => {
      if (info?.message) {
        toast.success(info.message);
      }
      setOpen(false);
      await qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure ?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          If you delete this category, all the related data will lose.
        </DialogDescription>
        <div>
          <ButtonWithLoading
            onClick={() => mutate({ categoryId })}
            isPending={isPending}
            variant={"destructive"}
          >
            Delete{" "}
          </ButtonWithLoading>
        </div>
      </DialogContent>
    </Dialog>
  );
}
