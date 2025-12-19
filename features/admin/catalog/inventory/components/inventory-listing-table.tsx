"use client";
import { DataTable } from "@/components/table/data-table";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Fragment } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getInventory } from "../queries";

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
                    <Edit /> Edit Product
                  </Fragment>
                ),
                access: {
                  show: "link",
                  link: `/admin/catalog/products/${row.original.id}/update`,
                },
              },

              {
                dropdownItem: (
                  <Fragment>
                    <Trash /> Delete
                  </Fragment>
                ),
                access: {
                  show: "dialog",
                  component: <div>fsfsfdasdfasd</div>,
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
