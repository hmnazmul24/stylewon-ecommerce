"use client";

import { cn } from "@/lib/utils";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { FileCog, Images, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useAddImage } from "./hooks/use-add-image";
import { deleteAssert } from "./server/actions";
import { LoadingSwap } from "../ui/loading-swap";

export function ImagesDeleteSection({ folderId }: { folderId: string }) {
  const { images, clearImages } = useAddImage();
  const qc = getQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const promises = images.map((img) => deleteAssert(img.publicId));
      await Promise.all(promises);
    },
    onSuccess: async () => {
      clearImages();
      await qc.invalidateQueries({ queryKey: ["asserts", folderId] });
    },
  });
  return images.length ? (
    <div className="mt-5 flex-col items-center gap-5 overflow-auto lg:flex">
      <Images className="size-20 opacity-50" />
      <h3>{images.length} file(s) is selected.</h3>
      <div className="w-full px-2">
        <Button
          onClick={() => mutate()}
          disabled={isPending}
          type="button"
          className="text-destructive w-full"
          variant={"ghost"}
        >
          <LoadingSwap isLoading={isPending}>
            <Trash />
          </LoadingSwap>{" "}
          Delete all selected
        </Button>
      </div>
    </div>
  ) : (
    <div className="mt-5 flex-col items-center gap-5 overflow-auto lg:flex">
      <FileCog className="size-20 opacity-50" />
      <h3>No file is selected.</h3>
    </div>
  );
}
export function ImagesDeleteSectionMobile({ folderId }: { folderId: string }) {
  const { images } = useAddImage();
  const qc = getQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const promises = images.map((img) => deleteAssert(img.publicId));
      await Promise.all(promises);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["asserts", folderId] });
    },
  });
  {
  }
  return (
    <div
      className={cn(
        "bg-background fixed bottom-0 z-50 mt-5 w-full items-center justify-between gap-5 rounded-b-lg p-4",
        images.length ? "flex" : "hidden",
      )}
    >
      <div className="flex items-center gap-3">
        <Images className="size-5 opacity-50" />
        <h3 className="text-sm">{images.length} file(s) is selected.</h3>
      </div>
      <div className="px-2">
        <Button
          disabled={isPending}
          onClick={() => mutate()}
          type="button"
          className="text-destructive w-full rounded-full"
          variant={"ghost"}
        >
          <LoadingSwap isLoading={isPending}>
            <Trash />
          </LoadingSwap>{" "}
          Delete all
        </Button>
      </div>
    </div>
  );
}
