"use client";
import { DataTable } from "@/components/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Notebook, QrCode, Trash } from "lucide-react";
import { Fragment, use } from "react";
import DataTableActionDropdown from "@/components/table/data-table-action-dropdown";
import { getProducts } from "../queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { SingleProductDetailsInfo } from "./single-product-details-info";
import { DeleteProduct } from "./delete-product";
import { DownloadAllQRCodePDF, DownloadSingleQRCode } from "./qr-code";

export default function ProductListingTable() {
  const { data: allProducts } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const columns: ColumnDef<Awaited<ReturnType<typeof getProducts>>[number]>[] =
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
        accessorKey: "id",
        header: "Product Id",
      },
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        header: "Price (Taka)",
        cell: ({ row }) => {
          return <div>{row.original.price}</div>;
        },
      },

      {
        header: "Shipping Weights",
        cell: ({ row }) => {
          return <div className="">{row.original.shippingWeight}</div>;
        },
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
                    <Notebook /> Detail Info
                  </Fragment>
                ),
                access: {
                  show: "sheet",
                  component: (
                    <SingleProductDetailsInfo productId={row.original.id} />
                  ),
                },
              },
              {
                dropdownItem: (
                  <Fragment>
                    <QrCode /> QR code
                  </Fragment>
                ),
                access: {
                  show: "dialog",
                  component: (
                    <DownloadSingleQRCode
                      id={row.original.id}
                      name={row.original.name}
                      price={row.original.price}
                    />
                  ),
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
                  component: <DeleteProduct productId={row.original.id} />,
                },
              },
            ]}
          />
        ),
      },
    ];
  return (
    <div>
      <DataTable columns={columns} data={allProducts} searchBy="name" />
      <DownloadAllQRCodePDF products={allProducts} />
    </div>
  );
}
