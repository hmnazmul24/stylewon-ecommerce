import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";

export default function AddProductBasicInfo({
  form,
}: {
  form: UseFormReturn<AddProductSchemaType>;
}) {
  // const description = form.watch("description");
  // useEffect(() => {
  //   if (!description) {
  //   }
  // }, [description]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Controller
            name="name"
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
          <Field>
            <FieldLabel>Descriptions</FieldLabel>
            <Suspense fallback={<div className="h-52 w-full"></div>}>
              <TiptapEditor
                setText={(value) => form.setValue("description", value)}
              />
            </Suspense>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
