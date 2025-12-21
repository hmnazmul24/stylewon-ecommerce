"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, ListStart, Loader2 } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { updateStock } from "../actions";
import { getQueryClient } from "@/tanstack-query/get-query-client";

const formSchema = z.object({ stock: z.string().min(1) });

export function UpdateStock({
  initialStock,
  productId,
  productName,
}: {
  initialStock: string;
  productId: string;
  productName: string;
}) {
  const qc = getQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stock: initialStock,
    },
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: updateStock,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return (
    <Card className="rounded-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChevronRight /> {productName}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit((data) =>
            mutation.mutate({ productId, stocks: data.stock }),
          )}
          className="space-y-4"
        >
          <Controller
            name="stock"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Avilable Stocks</FieldLabel>
                <Input
                  type="number"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  onChange={onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Update Stock
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
