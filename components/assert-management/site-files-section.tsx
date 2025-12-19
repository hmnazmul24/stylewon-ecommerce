import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useAddImage } from "./hooks/use-add-image";
import { getAsserts } from "./server/queries";
import { UploadButton } from "./upload-button";

export function SiteFilesSection({
  activeFolderId,
}: {
  activeFolderId: string;
}) {
  const { isPending, data, error } = useQuery({
    queryFn: () => getAsserts({ folderId: activeFolderId }),
    queryKey: ["asserts", activeFolderId],
    enabled: !!activeFolderId,
  });

  if (!activeFolderId) {
    return (
      <div className="flex items-center justify-center p-6">
        No folder is selected
      </div>
    );
  }
  if (isPending) {
    return (
      <div className="grid grid-cols-4 gap-1 p-1 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-1 overflow-y-auto p-1 xl:grid-cols-6">
      {data.map((item, i) => (
        <ImageCard key={i} publicId={item.publicId} url={item.secureUrl} />
      ))}
      <div className="p-2">
        <UploadButton
          folderName={
            data.find((f) => f.folderId === activeFolderId)?.folderId || ""
          }
          folderId={activeFolderId}
        />
      </div>
    </div>
  );
}

function ImageCard({ url, publicId }: { url: string; publicId: string }) {
  const { images, addImage, removeImage } = useAddImage();

  return (
    <div
      onClick={() =>
        images.find((imgInfo) => imgInfo.publicId === publicId)
          ? removeImage(publicId)
          : addImage({ url, publicId })
      }
      className={cn(
        "border transition-all",
        images.find((imgInfo) => imgInfo.publicId === publicId) && "ring",
      )}
    >
      <div className="">
        <Image src={url} height={400} width={400} alt="site-image" />
      </div>
      <div className="flex gap-1 p-1"></div>
    </div>
  );
}
