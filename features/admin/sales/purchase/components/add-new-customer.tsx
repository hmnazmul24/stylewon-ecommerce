"use client";

import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BD_PHONE_REGEX } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createAdminUser } from "../actions";

//-------------zod--------------------//
export const newUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.union([z.literal(""), z.email("Invalid email address")]).optional(),
  phoneNo: z
    .string()
    .min(1, "Phone number is required")
    .regex(BD_PHONE_REGEX, "Enter a valid Bangladesh phone number"),
  address: z.string().optional(),
});
export type NewUserSchemaType = z.infer<typeof newUserSchema>;

export function AddNewCustomer({
  setCustomerId,
}: {
  setCustomerId: (v: string) => void;
}) {
  const form = useForm<NewUserSchemaType>({
    defaultValues: {
      address: "",
      email: "",
      name: "",
      phoneNo: "",
    },
    resolver: zodResolver(newUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
        form.reset();
      }
      if (data.message) {
        toast.success(data.message);
        setCustomerId(data.customerId);
        form.reset();
      }
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Customer</CardTitle>
        <CardDescription>Add new customer for future</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-new-customer"
          onSubmit={form.handleSubmit((v) => mutate(v))}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-customer-name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="new-customer-name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-customer-email">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-customer-email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phoneNo"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-customer-phone">
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-customer-phone"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-customer-text-area">
                    Address
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="new-customer-text-area"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field className="justify-end" orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <ButtonWithLoading
            isPending={isPending}
            type="submit"
            form="form-new-customer"
          >
            Submit
          </ButtonWithLoading>
        </Field>
      </CardFooter>
    </Card>
  );
}
