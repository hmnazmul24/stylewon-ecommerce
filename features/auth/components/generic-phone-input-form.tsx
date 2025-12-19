"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButtonWithLoading } from "./submit-button-with-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BD_PHONE_REGEX } from "../schemas";

type GenericPhoneFormProps = {
  defaultValue?: string;
  submitLabel?: string;
  onSubmit: (value: z.infer<typeof phoneSchema>) => Promise<void>;
};

const phoneSchema = z.object({
  phoneNo: z.string().regex(BD_PHONE_REGEX, "Enter a valid phone number"),
});
export function GenericPhoneInputForm({
  defaultValue = "",
  submitLabel = "Submit",
  onSubmit,
}: GenericPhoneFormProps) {
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNo: defaultValue,
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(async (v: z.infer<typeof phoneSchema>) => {
        await onSubmit(v);
      })}
    >
      <FieldGroup className="gap-4">
        <Controller
          name="phoneNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Phone number</FieldLabel>
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
