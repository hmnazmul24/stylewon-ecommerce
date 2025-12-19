import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductHeading() {
  return (
    <div className="flex items-center justify-between  mb-5">
      <h2 className="font-semibold text-xl">Products</h2>
      <Link href={"/admin/catalog/products/add-new"}>
        <Button className="rounded-full">
          Add Products <Plus />
        </Button>
      </Link>
    </div>
  );
}
