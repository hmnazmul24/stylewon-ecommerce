"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          await authClient.signOut();
          router.push("/");
        });
      }}
      variant={"ghost"}
      className="text-destructive mt-2 w-full justify-start rounded-sm p-6 px-5"
    >
      <LoadingSwap isLoading={isPending}>
        <LucideLogOut />
      </LoadingSwap>
      {"Sign out"}
    </Button>
  );
}
