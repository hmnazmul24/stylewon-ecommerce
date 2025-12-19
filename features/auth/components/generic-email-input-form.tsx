"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";

type GenericPhoneFormProps = {
  defaultValue?: string;
  submitLabel?: string;
  onSubmit: (value: z.infer<typeof emailSchema>) => Promise<void>;
};

const emailSchema = z.object({
  email: z.email("Enter a valid email address"),
});
export function GenericEmailInputForm({
  defaultValue = "",
  submitLabel = "Submit",
  onSubmit,
}: GenericPhoneFormProps) {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: defaultValue,
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(async (v: z.infer<typeof emailSchema>) => {
        await onSubmit(v);
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email address</FieldLabel>
              <Input
                className="h-10"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <SubmitButtonWithLoading isPending={isSubmitting}>
            {submitLabel}
          </SubmitButtonWithLoading>
        </Field>
      </FieldGroup>
    </form>
  );
}
