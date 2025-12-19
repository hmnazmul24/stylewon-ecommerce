"use client";

export const AspectRatio = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
];
export async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95);
  });
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });

import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
// import { getCroppedImg } from "./utils/cropImage";
// import { AspectRatio } from "./utils/aspectRatios";

export default function ImageCropper({
  file,
  onDone,
}: {
  file: File;
  onDone: (croppedBlob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const result = await getCroppedImg(
      URL.createObjectURL(file),
      croppedAreaPixels
    );
    onDone(result);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[70vh]">
      {/* Cropper */}
      <div className="relative w-full h-full bg-black/40 rounded-md overflow-hidden">
        <Cropper
          image={URL.createObjectURL(file)}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={(z) => setZoom(z)}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 bg-accent p-4 rounded-md">
        {/* Predefined Aspect Ratios */}
        <div className="flex gap-2 flex-wrap">
          {AspectRatio.map((item) => (
            <Button
              key={item.label}
              variant={aspect === item.value ? "default" : "secondary"}
              className="px-4"
              onClick={() => setAspect(item.value)}
            >
              {item.label}
            </Button>
          ))}

          {/* Free Crop */}
          <Button
            variant={!aspect ? "default" : "secondary"}
            onClick={() => setAspect(undefined)}
          >
            Free
          </Button>
        </div>

        {/* Zoom Slider */}
        <div>
          <p className="text-sm mb-1">Zoom</p>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(v) => setZoom(v[0])}
          />
        </div>

        {/* Finish Button */}
        <Button onClick={handleCrop} className="w-full rounded-full">
          Crop & Save
        </Button>
      </div>
    </div>
  );
}
