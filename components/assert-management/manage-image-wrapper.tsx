"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { FolderCreateButton, FolderLists } from "./folder-lists-and-actions";
import { useAddImage } from "./hooks/use-add-image";
import {
  ImagesDeleteSection,
  ImagesDeleteSectionMobile,
} from "./image-delete-section";
import { SiteFilesSection } from "./site-files-section";

export function ManageImageWrapper({
  children,
  onSetImages,
}: {
  children: React.ReactNode;
  onSetImages: (images: string[]) => void;
}) {
  const { images, clearImages } = useAddImage();
  const [activeFolderId, setActiveFolderId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[88vh] min-w-[97vw] flex-col overflow-hidden p-0 lg:h-[85vh] lg:min-w-[85vw]">
        <DialogHeader className="relative p-4 pt-6 md:px-6">
          <DialogTitle className="text-start">
            <span>Asset Management</span>
            {images.length !== 0 && (
              <div className="absolute top-10 right-4 lg:right-4">
                <Button
                  type="button"
                  onClick={() => {
                    onSetImages(images.map((image) => image.url));
                    setOpenDialog(false);
                    clearImages();
                  }}
                  className="rounded-full"
                >
                  Add <span className="hidden md:block">to page</span> (
                  {images.length})
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="w-2/3 text-start">
            Upload, delete, structure your assets here.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[50vh] flex-1 rounded-md">
          <div className="grid h-full grid-cols-1 border lg:grid-cols-[200px_1fr_280px]">
            <section className="relative overflow-y-auto border-r lg:block">
              <FolderCreateButton />
              <FolderLists
                activeFolderId={activeFolderId}
                setActiveFolderId={setActiveFolderId}
              />
            </section>
            <section className="relative overflow-y-auto border-r">
              <SiteFilesSection activeFolderId={activeFolderId} />
            </section>
            <section>
              <div className="hidden lg:block">
                <ImagesDeleteSection folderId={activeFolderId} />
              </div>
              <div className="block lg:hidden">
                <ImagesDeleteSectionMobile folderId={activeFolderId} />
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
