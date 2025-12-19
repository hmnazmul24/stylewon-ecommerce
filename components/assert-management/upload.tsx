"use client";
import { Crop, Trash } from "lucide-react";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingSwap } from "../ui/loading-swap";
import imageCompression from "browser-image-compression";
import { uploadAssert } from "./server/actions";

type UploadType = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  folderId: string;
  folderName: string;
};
export default function Upload({
  files,
  setFiles,
  folderId,
  folderName,
}: UploadType) {
  const maxSizeMB = folderName === "marketing-banner" ? 5 : 0.4;
  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // 1️⃣ Compress all images in parallel
      const compressedFiles = await Promise.all(
        files.map((file) => imageCompression(file, options)),
      );

      // 2️⃣ Prepare uploads in parallel
      const uploadPromises = compressedFiles.map(async (compressedFile) => {
        const formData = new FormData();
        formData.append("imageFile", compressedFile);
        return uploadAssert({ formData, folderId }); // your server action
      });

      // 3️⃣ Wait for all server uploads to finish
      await Promise.all(uploadPromises);
      setFiles([]);
      return { message: "Uploaded Successfully" };
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      qc.invalidateQueries({ queryKey: ["asserts", folderId] });
    },
  });
  const getUrl = (f: File) => {
    return URL.createObjectURL(f);
  };

  return (
    <Fragment>
      <div className="overflow-y-auto">
        <div className="space-y-0.5">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-sm border"
            >
              <Image
                key={getUrl(file)}
                src={getUrl(file)}
                height={500}
                width={500}
                className="w-full"
                alt="slected"
              />
              <div className="absolute top-1 right-1 flex gap-1">
                <Button>
                  <Crop />
                </Button>
                <Button
                  onClick={() => {
                    const newFiles = files.filter((_, i) => i !== index);
                    setFiles(newFiles);
                    toast.info("Removed");
                  }}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Button
          onClick={() => setFiles([])}
          variant={"outline"}
          className="w-full rounded-full"
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          onClick={() => mutate()}
          className="w-full rounded-full"
        >
          <LoadingSwap isLoading={isPending}>Upload</LoadingSwap>
        </Button>
      </div>
    </Fragment>
  );
}
