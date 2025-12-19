"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";
import { LoadingSwap } from "@/components/ui/loading-swap";

export default function AddProdutActionBtns({
  form,
  isPending,
}: {
  form: UseFormReturn<AddProductSchemaType>;
  isPending: boolean;
}) {
  return (
    <Field orientation={"horizontal"} className="justify-end mb-16">
      <Button
        type="button"
        onClick={() => form.reset()}
        variant={"outline"}
        className="rounded-full"
      >
        Cancel
      </Button>
      <Button disabled={isPending} type="submit" className="rounded-full">
        <LoadingSwap isLoading={isPending}>Submit</LoadingSwap>
      </Button>
    </Field>
  );
}
