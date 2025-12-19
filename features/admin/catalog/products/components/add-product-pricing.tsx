import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function AddProductPricing({
  form,
}: {
  form: UseFormReturn<AddProductSchemaType>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing (Taka)</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Controller
            name="price"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Price</FieldLabel>
                <Input
                  type="number"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    const costs = Number(form.getValues("costOfGoods"));
                    const profit = price - costs;
                    const margin = price > 0 ? (profit / price) * 100 : 0;
                    form.setValue("profit", String(profit));
                    form.setValue("margin", String(margin));
                    onChange(e);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="costOfGoods"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Costs of Goods</FieldLabel>
                <Input
                  type="number"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  onChange={(e) => {
                    const price = Number(form.getValues("price"));
                    const costs = Number(e.target.value);
                    const profit = price - costs;
                    const margin = price > 0 ? (profit / price) * 100 : 0;
                    form.setValue("profit", String(profit));
                    form.setValue("margin", String(margin));
                    onChange(e);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field orientation={"horizontal"}>
            <Field>
              <FieldLabel>Profit</FieldLabel>
              <Input disabled value={form.watch("profit") ?? ""} />
            </Field>
            <Field>
              <FieldLabel>Margin (%)</FieldLabel>
              <Input
                disabled
                value={Math.round(Number(form.watch("margin") ?? 0))}
              />
            </Field>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
