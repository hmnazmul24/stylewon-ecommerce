"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { SubmitButtonWithLoading } from "../submit-button-with-loading";
import { ProfileComponentPropsType } from "../../types";

const nameSchema = z.object({
  name: z.string().min(3, "name must be at least 3 char"),
});

export function AddOrUpdateName({
  user,
  onSuccess,
}: ProfileComponentPropsType) {
  const qc = getQueryClient();
  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: z.infer<typeof nameSchema>) => {
      const res = await authClient.updateUser({
        name: input.name,
      });

      if (res.data) {
        toast.success("Name is updated");
        await qc.invalidateQueries({ queryKey: ["user-info"] });
        onSuccess && onSuccess();
      }
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit((v) => mutate(v))}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Full name</FieldLabel>
              <Input
                className="h-10"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <SubmitButtonWithLoading isPending={isPending}>
          Update
        </SubmitButtonWithLoading>
      </FieldGroup>
    </form>
  );
}
