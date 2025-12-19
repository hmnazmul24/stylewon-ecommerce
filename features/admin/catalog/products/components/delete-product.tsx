"use client";

import { Button } from "@/components/ui/button";
import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { deleteProduct } from "../actions";

const delSchema = z.object({
  text: z
    .string()
    .min(1, "Please type delete to confirm")
    .refine((val) => val.trim().toLowerCase() === "delete", {
      message: 'You must type "delete" to confirm',
    }),
});

export function DeleteProduct({ productId }: { productId: string }) {
  const qc = getQueryClient();

  const form = useForm<z.infer<typeof delSchema>>({
    resolver: zodResolver(delSchema),
    defaultValues: { text: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async ({ message }) => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(message);
      form.reset();
    },
  });

  return (
    <Card className="bg-background w-full border-none">
      <CardHeader>
        <CardTitle className="text-destructive text-lg font-bold">
          Delete Product
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          This action cannot be undone. Please confirm.
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(() => mutate({ productId }))}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="text"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Type <span className="font-semibold">delete</span> to
                    confirm:
                  </FieldLabel>

                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="delete"
                    disabled={isPending}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end pt-2">
              <ButtonWithLoading
                isPending={isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Delete
              </ButtonWithLoading>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
