"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ButtonWithLoading } from "@/components/shared/button-with-loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { updateDeliverCharge } from "../actionts";
import { toast } from "sonner";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { useRouter } from "next/navigation";

type DeliveryChargeForm = {
  insideDhaka: string;
  outsideDhaka: string;
};

export function DeliveryCharge({
  insideDhaka,
  outsideDhaka,
}: DeliveryChargeForm) {
  const router = useRouter();
  const form = useForm<DeliveryChargeForm>({
    defaultValues: {
      insideDhaka,
      outsideDhaka,
    },
  });

  const mutation = useMutation({
    mutationFn: updateDeliverCharge,
    onSuccess: () => {
      router.refresh();
      toast.success("Updated");
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          Delivery Charge Configuration
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Set delivery fees based on the current market standard
        </p>
      </CardHeader>

      <CardContent className="w-full">
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-6"
        >
          {/* Charges */}
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border p-4">
              <Field>
                <FieldLabel>Inside Dhaka</FieldLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                    ৳
                  </span>
                  <Input
                    {...form.register("insideDhaka")}
                    className="pl-7"
                    placeholder="66"
                  />
                </div>
                <FieldError>
                  {form.formState.errors.insideDhaka?.message}
                </FieldError>
              </Field>

              <p className="text-muted-foreground text-xs">
                Applied for deliveries within Dhaka city
              </p>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <Field>
                <FieldLabel>Outside Dhaka</FieldLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                    ৳
                  </span>
                  <Input
                    {...form.register("outsideDhaka")}
                    className="pl-7"
                    placeholder="99"
                  />
                </div>
                <FieldError>
                  {form.formState.errors.outsideDhaka?.message}
                </FieldError>
              </Field>

              <p className="text-muted-foreground text-xs">
                Applied for nationwide delivery
              </p>
            </div>
          </FieldGroup>

          {/* Action */}
          <CardFooter className="px-0 pt-2 pb-0">
            <ButtonWithLoading
              type="submit"
              isPending={mutation.isPending}
              className="w-full"
            >
              Save Delivery Charges
            </ButtonWithLoading>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
