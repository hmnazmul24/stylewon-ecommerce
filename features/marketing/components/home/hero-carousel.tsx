"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
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
      <div
        ref={emblaRef}
        className="relative m-auto max-w-5xl overflow-hidden rounded-md"
      >
        {/* Track */}
        <div className="flex gap-1 rounded-md">
          {slides.map((src, index) => (
            <div key={index} className="w-full shrink-0">
              <div className="relative h-[180px] overflow-hidden rounded-sm md:h-80">
                <Image
                  height={500}
                  width={500}
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Optional overlay */}
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
