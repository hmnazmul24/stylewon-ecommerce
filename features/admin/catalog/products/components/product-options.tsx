"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
export default function ProductOptions() {
  return (
    <Dialog>
      <div>
        Does your product come in different options, like size, color or
        material? Add them here.
      </div>
      <DialogTrigger asChild>
        <Button type="button" className="rounded-full">
          <Plus /> Add Options
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <ProductOptionsBox />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function ProductOptionsBox() {
  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem iure
      et excepturi quia, rerum enim earum delectus maiores error accusamus
      ducimus nemo placeat accusantium dignissimos! Eum perspiciatis officiis
      neque ad.
    </div>
  );
}
