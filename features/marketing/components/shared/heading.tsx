import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export function NavigateHeading({
  children,
  className,
  link,
}: {
  children: ReactNode;
  className?: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <div
        className={cn(
          "mb-1 flex items-center gap-2 py-2 text-lg font-semibold md:text-xl",
          className,
        )}
      >
        <ChevronLeft /> {children}
      </div>
    </Link>
  );
}

export function Heading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-primary relative flex items-center justify-center py-2 text-base font-bold md:py-6 md:text-xl",
        className,
      )}
    >
      <span> {children}</span>
      {/* <Image
        src={"/line.svg"}
        className="absolute top-8 h-9 w-16 object-contain md:top-9 md:w-52"
        height={1}
        width={300}
        alt="line-svg"
      /> */}
    </div>
  );
}
