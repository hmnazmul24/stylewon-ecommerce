"use client";
import Error from "@/components/shared/error";
import Loading from "@/components/shared/loading";
import { useQuery } from "@tanstack/react-query";
import { getProductWithDetails } from "../queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function SingleProductDetailsInfo({ productId }: { productId: string }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["single-product", productId],
    queryFn: () => getProductWithDetails(productId),
  });
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }
  if (!data) {
    return <h3>No data Exists</h3>;
  }
  return <ProductDetailsUI data={data} />;
}

export function ProductDetailsUI({
  data,
}: {
  data: Awaited<ReturnType<typeof getProductWithDetails>>;
}) {
  return (
    <div className="max-h-[89vh] translate-y-4 space-y-4 overflow-y-auto">
      {/* Images */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {data.images.map((img, i) => (
          <div key={i} className="bg-muted size-20 overflow-hidden rounded-lg">
            <Image
              src={img}
              alt={data.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <Separator />

      {/* Name & Price */}
      <div>
        <h2 className="text-lg font-semibold">{data.name}</h2>
        <p className="mt-1 text-xl font-bold">৳ {data.price}</p>
      </div>

      {/* Basic Meta */}
      <Card className="rounded-xl border">
        <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Profit</p>
            <p className="font-medium">৳ {data.profit}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Margin</p>
            <p className="font-medium">{data.margin}%</p>
          </div>
          {data.costOfGoods && (
            <div>
              <p className="text-muted-foreground text-xs">Cost Price</p>
              <p className="font-medium">৳ {data.costOfGoods}</p>
            </div>
          )}
          {data.stocks && (
            <div>
              <p className="text-muted-foreground text-xs">Stock</p>
              <p className="font-medium">{data.stocks}</p>
            </div>
          )}
          {data.shippingWeight && (
            <div>
              <p className="text-muted-foreground text-xs">Shipping Weight</p>
              <p className="font-medium">{data.shippingWeight}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sizes */}
      <div>
        <p className="mb-1 text-sm font-medium">Sizes</p>
        <div className="flex flex-wrap gap-2">
          {data.sizes.map((s) => (
            <Badge key={s.value} variant="secondary" className="px-3 py-1">
              {s.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="mb-1 text-sm font-medium">Colors</p>
        <div className="flex flex-wrap gap-3">
          {data.colors.map((c) => (
            <div key={c.value} className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-full border"
                style={{
                  backgroundColor: c.hexColor || "#ddd",
                }}
              />
              <span className="text-sm">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <div>
          <p className="mb-1 text-sm font-medium">Description</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {data.description}
          </p>
        </div>
      )}
    </div>
  );
}
