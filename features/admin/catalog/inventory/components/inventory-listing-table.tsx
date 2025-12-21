"use client";
import { DataTable } from "@/components/table/data-table";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { Boxes, Edit, SendToBack, Trash } from "lucide-react";
import { Fragment } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getInventory } from "../queries";
import { UpdateStock } from "./update-stock";

export function InventoryListingTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });

  const columns: ColumnDef<Awaited<ReturnType<typeof getInventory>>[number]>[] =
    [
      {
        header: "Image",
        cell: ({ row }) => {
          return (
            <Image
              src={row.original.images[0] ?? ""}
              height={50}
              width={50}
              className="size-10 rounded-md object-cover"
              alt="product_image"
            />
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "stocks",
        header: "Stock",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DataTableActionDropdown
            items={[
              {
                dropdownItem: (
                  <Fragment>
                    <Boxes /> Update Stock
                  </Fragment>
                ),
                access: {
                  show: "dialog",
                  component: (
                    <UpdateStock
                      productId={row.original.id}
                      initialStock={row.original.stocks || "0"}
                      productName={row.original.name}
                    />
                  ),
                },
              },
            ]}
          />
        ),
      },
    ];
  return (
    <div>
      <DataTable columns={columns} data={data} searchBy="name" />
    </div>
  );
}
