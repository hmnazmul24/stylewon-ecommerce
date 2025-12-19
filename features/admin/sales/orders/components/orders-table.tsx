"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { Album, Notebook, Trash } from "lucide-react";
import { Fragment, use } from "react";
import { getOrders } from "../queries";
import ChangeOrderStatus, { OrderStatus } from "./change-status";
import DetailOrdersItems from "./detail-order-items";

export default function OrdersTable({
  promise,
}: {
  promise: ReturnType<typeof getOrders>;
}) {
  const allOrders = use(promise);

  const columns: ColumnDef<Awaited<ReturnType<typeof getOrders>>[number]>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableActionDropdown
          items={[
            {
              dropdownItem: (
                <Fragment>
                  <Album /> Chnage Status
                </Fragment>
              ),
              access: {
                show: "dialog",
                component: (
                  <ChangeOrderStatus
                    currentStatus={row.original.status as OrderStatus}
                    orderId={row.original.id}
                  />
                ),
              },
            },
            {
              dropdownItem: (
                <Fragment>
                  <Notebook /> Detail Info
                </Fragment>
              ),
              access: {
                show: "sheet",
                component: <DetailOrdersItems orderId={row.original.id} />,
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
                component: <div>delete</div>,
              },
            },
          ]}
        />
      ),
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={allOrders} searchBy="id" />
    </div>
  );
}
