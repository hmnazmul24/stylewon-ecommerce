"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function GoogleSignInButton() {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const res = await authClient.signIn.social({
        provider: "google",
      });
      if (res.error) {
        toast.error(res.error.message || res.error.statusText);
      }
    },
  });
  return (
    <Button
      disabled={isPending}
      type="button"
      onClick={() => mutate()}
      variant={"outline"}
      className="h-10"
    >
      <LoadingSwap isLoading={isPending}>
        <FcGoogle />
      </LoadingSwap>{" "}
      Continue with google
    </Button>
  );
}
