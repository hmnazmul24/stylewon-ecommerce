"use client";
import { Spinner } from "../ui/spinner";

export default function Loading() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="p-12">
        <Spinner />
      </div>
    </div>
  );
}
