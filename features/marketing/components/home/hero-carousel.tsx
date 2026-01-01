"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getBanner } from "@/features/admin/catalog/console/actionts";
import { useQuery } from "@tanstack/react-query";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

const options: EmblaOptionsType = {
  loop: true,
  align: "start",
  active: true,
  duration: 50,
};

const slides = [
  "/banner-daraz-1.avif",
  "/banner-daraz-2.avif",
  "/banner-daraz-3.avif",
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { isPending, data } = useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanner(),
  });
  // Auto scroll every 1 second
  React.useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [emblaApi]);
  return (
    <section className="relative w-full p-2">
      {/* Viewport */}
      {isPending ? (
        <Skeleton className="m-auto h-[200] w-full max-w-5xl rounded-md md:h-80" />
      ) : (
        <div
          ref={emblaRef}
          className="relative m-auto max-w-5xl overflow-hidden rounded-md"
        >
          {/* Track */}
          <div className="flex gap-1 rounded-md">
            {data?.map((banner) => (
              <div key={banner.id} className="w-full shrink-0">
                <Link href={banner.redirectTo || "#"}>
                  <div className="relative h-[200px] overflow-hidden rounded-sm md:h-80">
                    <Image
                      height={500}
                      width={1000}
                      src={banner.imageUrl || ""}
                      alt={banner.id}
                      className="h-full w-full object-cover"
                    />

                    {/* Optional overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
