import { Button } from "@/components/ui/button";
import { Filter, FilterIcon, FilterX } from "lucide-react";
import React from "react";

export function ProductFilter() {
  return (
    <div className="flex items-center justify-between bg-emerald-900 px-2 py-1">
      <div></div>
      <Button>Categories</Button>
    </div>
  );
}
