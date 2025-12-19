"use client";

import { ManageImageWrapper } from "@/components/assert-management/manage-image-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { AddProductSchemaType } from "../schemas";

export default function AddProductImage({
  form,
}: {
  form: UseFormReturn<AddProductSchemaType>;
}) {
  const images = form.watch("images");

  const onSetImages = (selectedImages: string[]) => {
    const existedImages = [...images];
    const marged = [...existedImages, ...selectedImages];
    const unique = Array.from(new Set(marged));
    form.setValue("images", unique);
    form.clearErrors("images");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-1 rounded-md md:grid-cols-4 lg:grid-cols-5">
          {images &&
            images.length !== 0 &&
            images.map((image, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                <Image
                  src={image}
                  height={100}
                  width={100}
                  className="w-full object-contain"
                  alt="product-img"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const newImages = images.filter((img) => img !== image);
                    form.setValue("images", newImages);
                  }}
                  className="absolute top-1 right-1 rounded-md"
                >
                  <Trash />
                </Button>
              </div>
            ))}
          <ManageImageWrapper onSetImages={onSetImages}>
            <div className="bg-background flex aspect-square items-center justify-center rounded-md border">
              <Plus />
            </div>
          </ManageImageWrapper>
        </div>
        <div className="text-destructive my-2 text-xs">
          {form.formState.errors.images?.message}
        </div>
      </CardContent>
    </Card>
  );
}
