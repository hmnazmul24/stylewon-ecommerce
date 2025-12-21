"use client";

import { useState } from "react";
import { ManageImageWrapper } from "@/components/assert-management/manage-image-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteBanner, getBanner, uploadBanner } from "../actionts";
import { toast } from "sonner";
import { getQueryClient } from "@/tanstack-query/get-query-client";
import { LoadingSwap } from "@/components/ui/loading-swap";

// ---------------------------------------------
// Types
// ---------------------------------------------

type SelectedBanner = {
  imageUrl: string;
  redirectTo: string;
};

// ---------------------------------------------
// Main Component
// ---------------------------------------------

export function BannerBox() {
  const qc = getQueryClient();
  // Images selected but not yet uploaded
  const [selected, setSelected] = useState<SelectedBanner[]>([]);

  // Already uploaded banners (fetched from server later)
  const { data: uploaded, isPending } = useQuery({
    queryFn: () => getBanner(),
    queryKey: ["banners"],
  });
  // ---------------------------------------------
  // Handlers
  // ---------------------------------------------

  function handleSetImages(urls: string[]) {
    setSelected((prev) => {
      const existingUrls = new Set(prev.map((p) => p.imageUrl));
      const next = urls
        .filter((url) => !existingUrls.has(url))
        .map((url) => ({ imageUrl: url, redirectTo: "" }));
      return [...prev, ...next];
    });
  }

  function handleRemoveSelected(imageUrl: string) {
    setSelected((prev) => prev.filter((i) => i.imageUrl !== imageUrl));
  }

  function handleRedirectChange(imageUrl: string, value: string) {
    setSelected((prev) =>
      prev.map((item) =>
        item.imageUrl === imageUrl ? { ...item, redirectTo: value } : item,
      ),
    );
  }

  const uploadMutation = useMutation({
    mutationFn: uploadBanner,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["banners"] });
      setSelected([]);
      toast.success("Banner uploaded");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner Deleted");
    },
  });

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Website Banners</CardTitle>
        <p className="text-muted-foreground text-sm">
          These banners will be shown on your homepage hero section
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Image picker */}
        <ManageImageWrapper onSetImages={handleSetImages}>
          <Button variant="outline">Add Image</Button>
        </ManageImageWrapper>

        {/* Selected (not uploaded yet) */}
        {selected.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Selected Images</h4>

            <div className="space-y-4">
              {selected.map((item) => (
                <div
                  key={item.imageUrl}
                  className="relative flex gap-4 rounded-xl border p-4"
                >
                  <Image
                    height={200}
                    width={200}
                    src={item.imageUrl}
                    alt="banner preview"
                    className="h-20 w-32 rounded-lg object-cover"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="space-y-3">
                      <Label>Redirect URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={item.redirectTo}
                        onChange={(e) =>
                          handleRedirectChange(item.imageUrl, e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-0 right-2"
                    onClick={() => handleRemoveSelected(item.imageUrl)}
                  >
                    <Trash2 className="text-muted-foreground size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                disabled={uploadMutation.isPending}
                onClick={() => uploadMutation.mutate(selected)}
                className="gap-2"
              >
                <Upload className="size-4" />{" "}
                <LoadingSwap isLoading={isPending}>Upload Banners</LoadingSwap>
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Uploaded banners */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Banners</h4>

          {isPending ? (
            <div>Loading...</div>
          ) : uploaded?.length === 0 ? (
            <div className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
              No banners uploaded yet
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uploaded?.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border"
                >
                  <Image
                    height={400}
                    width={400}
                    src={item.imageUrl}
                    alt="uploaded banner"
                    className="h-32 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-muted-foreground truncate p-3 text-xs">
                      {item.redirectTo || ""}
                    </div>
                    <Button
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(item.id)}
                      variant={"ghost"}
                      className="text-destructive size-8 rounded-full"
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
