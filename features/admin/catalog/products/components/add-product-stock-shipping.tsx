import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";

export default function AddProductStockAndShipping({
  form,
}: {
  form: UseFormReturn<AddProductSchemaType>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock & Shipping</CardTitle>
      </CardHeader>
      <CardContent>
        <Field orientation={"horizontal"} className="items-start">
          <Controller
            name="stocks"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Stocks</FieldLabel>
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
          <Controller
            name="shippingWeight"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Shipping (kg)</FieldLabel>
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
        </Field>
      </CardContent>
    </Card>
  );
}
