"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import { ShieldCheck } from "lucide-react";
import { Fragment } from "react";
import { Role, UpdateRole } from "./update-role";

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
      cell: ({ row }) =>
        process.env.NEXT_PUBLIC_SUPER_ADMIN_ID !== row.original.id ? (
          <DataTableActionDropdown
            items={[
              {
                dropdownItem: (
                  <Fragment>
                    <ShieldCheck /> Update role
                  </Fragment>
                ),
                access: {
                  show: "dialog",
                  component: (
                    <UpdateRole
                      initialRole={(row.original.role as Role) || "customer"}
                      userId={row.original.id}
                    />
                  ),
                },
              },
            ]}
          />
        ) : null,
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={users} searchBy="id" />
    </div>
  );
}
