"use client";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import React from "react";

export function ButtonWithLoading({
  isPending,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { isPending?: boolean }) {
  return (
    <Button type="submit" disabled={isPending} {...props}>
      <LoadingSwap isLoading={isPending ?? false}>{children}</LoadingSwap>
    </Button>
  );
}
