"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

export type DataTableActionDropdownItem = {
  access: {
    show: "dialog" | "sheet" | "link";
    component?: JSX.Element;
    link?: string;
  };
  className?: string;
  dropdownItem: React.JSX.Element;
};

type Props = {
  items: DataTableActionDropdownItem[];
};

export default function DataTableActionDropdown({ items }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [activeComponent, setActiveComponent] = useState<JSX.Element | null>(
    null
  );

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {items.map((item, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() => {
                if (item.access.component) {
                  setActiveComponent(item.access.component);
                }
                switch (item.access.show) {
                  case "dialog":
                    setOpenDialog(true);
                    break;

                  case "sheet":
                    setOpenSheet(true);
                    break;

                  default:
                    {
                      setOpen(false);
                      setTimeout(() => {
                        if (item.access.link) {
                          router.push(item.access.link);
                        }
                      }, 300);
                    }
                    break;
                }
              }}
            >
              {item.dropdownItem}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTitle></DialogTitle>
        <DialogContent>{activeComponent}</DialogContent>
      </Dialog>

      {/* Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <DialogTitle></DialogTitle>
        <SheetContent className="p-6">{activeComponent}</SheetContent>
      </Sheet>
    </div>
  );
}
