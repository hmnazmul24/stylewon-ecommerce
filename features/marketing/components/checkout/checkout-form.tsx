"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { districts, upazilas } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Edit, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { billingInfoSchema, BillingSchemaType } from "../../schemas";
import {
  getBillingsInfo,
  updateBillingsInfo,
} from "../../server/billing.actions";
import { BillingsPhoneNumberEdit } from "./billing-phone-number-edit";

export function BillingForm() {
  const {
    data: { billings },
  } = useSuspenseQuery({
    queryKey: ["billings"],
    queryFn: () => getBillingsInfo(),
  });
  const router = useRouter();
  const params = useSearchParams().get("redirect_to");

  const form = useForm<BillingSchemaType>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      fullName: billings ? billings.fullName : "",
      address: billings ? billings.address : "",
      phone: billings ? billings.phone : "",
      districtId: billings ? billings.districtId : "",
      upazilaId: billings ? billings.upazilaId : "",
      email: billings ? (billings.email ?? "") : "",
      note: billings ? (billings.note ?? "") : "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (inputs: BillingSchemaType) => {
      await updateBillingsInfo(inputs);
      toast.success("Billing info updated");
      if (params === "payment") {
        router.push("/checkout/payment");
      }
    },
  });

  const selectedDistrictId = form.watch("districtId");
  const filteredUpazilas = selectedDistrictId
    ? upazilas.filter((u) => u.district_id === selectedDistrictId)
    : [];

  return (
    <Card className="m-auto rounded-sm">
      <CardHeader>
        <CardTitle>Billings Info</CardTitle>
        <CardDescription>
          Add or update info for billings & shippings
        </CardDescription>
      </CardHeader>
      <CardContent className=" ">
        <form onSubmit={form.handleSubmit((v) => mutate(v))}>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone No.</FieldLabel>
                  <div className="flex items-center gap-4">
                    <Badge>{field.value || "No number added"}</Badge>
                    <BillingsPhoneNumberEdit
                      phoneNumber={billings.phone}
                      setPhoneNumber={(v) => field.onChange(v)}
                    >
                      <Button type="button" variant={"ghost"}>
                        <Edit />
                        Edit
                      </Button>
                    </BillingsPhoneNumberEdit>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="districtId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                  className="flex-col! items-start!"
                >
                  <FieldLabel>District</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("upazilaId", "");
                    }}
                  >
                    <SelectTrigger
                      id="form-rhf-select-district"
                      aria-invalid={fieldState.invalid}
                      className="w-full!"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} {d.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="upazilaId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                  className="flex-col! items-start!"
                >
                  <FieldLabel>Upazila</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-area"
                      aria-invalid={fieldState.invalid}
                      className="w-full!"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {filteredUpazilas.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email (optional)</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Note (optional)</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation={"vertical"} className="justify-end">
              <Button disabled={isPending}>
                Save billing info
                <LoadingSwap isLoading={isPending}>
                  <Save />
                </LoadingSwap>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
