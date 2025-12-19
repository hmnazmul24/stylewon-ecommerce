"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileUp, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import ImageCropper from "./image-croper";
import Upload from "./upload";

export function UploadButton({
  className,
  folderId,
  folderName,
}: {
  className?: string;
  folderId: string;
  folderName: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cropped, setCropped] = useState<Blob | null>(null);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: setSelectedFiles,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Dialog onOpenChange={() => setSelectedFiles([])}>
      <DialogTrigger asChild>
        <Button className={cn("rounded-full", className)}>
          <span className="hidden md:block">Upload</span>{" "}
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[70vh] max-w-[96vw] flex-col p-4 lg:h-[80vh] lg:max-w-[40vw] lg:p-3">
        <DialogHeader>
          <DialogTitle className="text-start">
            Upload Image{" "}
            {selectedFiles.length ? `(${selectedFiles.length})` : null}
          </DialogTitle>
        </DialogHeader>

        {selectedFiles.length === 0 ? (
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-1 items-center justify-center rounded-md border-2 border-dashed transition-all",
              "bg-accent/40",
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30",
            )}
          >
            <input {...getInputProps()} />
            <div className="pointer-events-none flex flex-col items-center gap-4">
              {isDragActive ? (
                <h6 className="text-primary font-medium">
                  Drop your files here…
                </h6>
              ) : (
                <>
                  <h6 className="font-medium">Drag & drop files here</h6>

                  <Button
                    onClick={open}
                    type="button"
                    className="pointer-events-auto gap-0 rounded-full"
                  >
                    Upload from computer <FileUp className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          // <ShowSelectedImages files={selectedFiles} /> //todo
          <Upload
            folderId={folderId}
            files={selectedFiles}
            setFiles={setSelectedFiles}
            folderName={folderName}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ShowSelectedImages({ files }: { files: File[] }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existedFiles, setExistedFiles] = useState<File[]>(files);
  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {existedFiles.map((file, i) => (
          <div
            onClick={() => setSelectedFile(file)}
            key={i}
            className="relative aspect-square overflow-hidden rounded-md border"
          >
            <Image
              src={URL.createObjectURL(file)}
              height={80}
              width={80}
              alt="selected"
            />
            <X className="bg-primary text-secondary absolute top-1 right-1 size-4 rounded-full" />
          </div>
        ))}
      </div>
      <ImageCropper
        file={selectedFile ?? existedFiles[0]}
        onDone={(blob) => {}}
      />
    </div>
  );
}
