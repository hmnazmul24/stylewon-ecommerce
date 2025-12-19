"use client";

import { getQueryClient } from "@/tanstack-query/get-query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FolderOpen, MoreVertical, Plus, Save, Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ButtonWithLoading } from "../shared/button-with-loading";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LoadingSwap } from "../ui/loading-swap";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import { createFolder, deleteFolder, updateFolderName } from "./server/actions";
import { getFolders } from "./server/queries";
import { cn } from "@/lib/utils";
import { useAddImage } from "./hooks/use-add-image";

export function FolderLists({
  setActiveFolderId,

  activeFolderId,
}: {
  setActiveFolderId: (v: string) => void;
  activeFolderId: string;
}) {
  const { clearImages } = useAddImage();
  const { data, isPending, error } = useQuery({
    queryKey: ["folders"],
    queryFn: () => getFolders(),
  });

  if (error) {
    return <div>Error</div>;
  }
  if (isPending) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, l) => (
          <Skeleton key={l} className="h-5 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="my-3 max-h-[100px] overflow-y-auto lg:max-h-none">
      {data.map((folder) => (
        <div
          key={folder.id}
          className={cn(
            "hover:bg-accent flex cursor-pointer items-center justify-between",
            activeFolderId === folder.id && "bg-accent",
          )}
        >
          <div
            onClick={() => {
              setActiveFolderId(folder.id);
              clearImages();
            }}
            key={folder.id}
            className="flex items-center gap-2 rounded-none px-2 py-2 text-xs"
          >
            <FolderOpen size={16} />{" "}
            <span className="w-[120px] truncate">{folder.folderName}</span>
          </div>
          {folder.folderName !== "marketing-banner" && (
            <FolderActionButton folderId={folder.id} name={folder.folderName} />
          )}
        </div>
      ))}
    </div>
  );
}

function FolderActionButton({
  folderId,
  name,
}: {
  folderId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon-sm"}
          className="rounded-none"
        >
          <MoreVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <FolderNameUpdateForm
          onClose={() => setOpen(false)}
          folderId={folderId}
          name={name}
        />

        <DeleteFolderButton
          folderId={folderId}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

export function FolderCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="bg-accent sticky top-0 p-2">
          <Button type="button" className="w-full rounded-full">
            <Plus /> Add Folder
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start">
        <FolderCreateForm onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
const addFolderSchema = z.object({
  folderName: z
    .string()
    .min(3, "Folder name must be at least 3 characters")
    .max(50, "folder can't be more than 50 char"),
});

function FolderCreateForm({ onClose }: { onClose: () => void }) {
  const qc = getQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createFolder,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["folders"] });
      form.reset();
      onClose();
    },
  });

  const form = useForm<z.infer<typeof addFolderSchema>>({
    resolver: zodResolver(addFolderSchema),
    defaultValues: { folderName: "" },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex flex-col gap-2"
    >
      <Controller
        name="folderName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Add new folder</FieldLabel>

            <Input
              {...field}
              className="h-10"
              aria-invalid={fieldState.invalid}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <ButtonWithLoading
        type="button"
        onClick={form.handleSubmit((v) => mutate(v.folderName))}
        className="w-full"
        isPending={isPending}
      >
        Submit
      </ButtonWithLoading>
    </form>
  );
}

function FolderNameUpdateForm({
  onClose,
  name,
  folderId,
}: {
  onClose: () => void;
  name: string;
  folderId: string;
}) {
  const qc = getQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateFolderName,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["folders"] });
      form.reset();
      onClose();
    },
  });

  const form = useForm<z.infer<typeof addFolderSchema>>({
    resolver: zodResolver(addFolderSchema),
    defaultValues: { folderName: name },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex flex-col gap-2"
    >
      <Controller
        name="folderName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Update folder</FieldLabel>

            <div className="flex items-center gap-1">
              <Input
                {...field}
                className="h-10"
                aria-invalid={fieldState.invalid}
              />
              <ButtonWithLoading
                type="button"
                onClick={form.handleSubmit((v) =>
                  mutate({ folderId, folderName: v.folderName }),
                )}
                isPending={isPending}
              >
                <Save />
              </ButtonWithLoading>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}

function DeleteFolderButton({
  folderId,
}: {
  folderId: string;
  onClose: () => void;
}) {
  const qc = getQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: async ({ error }) => {
      if (error) {
        toast.info(
          "to delete folder, you must delete all the asserts within it",
        );
      } else {
        await qc.invalidateQueries({ queryKey: ["folders"] });
      }
    },
  });
  return (
    <Button
      onClick={() => mutate(folderId)}
      disabled={isPending}
      type="button"
      className="w-full"
      variant={"destructive"}
    >
      <LoadingSwap isLoading={isPending}>
        <Trash />
      </LoadingSwap>
      Delete this folder
    </Button>
  );
}
