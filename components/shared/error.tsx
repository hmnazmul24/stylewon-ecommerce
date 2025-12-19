"use client";
import { AlertCircle } from "lucide-react";

export default function Error() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="p-12">
        <AlertCircle />
      </div>
    </div>
  );
}
