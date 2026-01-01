"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";

export function UserListingTable({ users }: { users: UserWithRole[] }) {
  const columns: ColumnDef<UserWithRole>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email Address",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "role",
      header: "Role",
    },

    {
      id: "actions",
      cell: ({ row }) => <DataTableActionDropdown items={[]} />,
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={users} searchBy="id" />
    </div>
  );
}
