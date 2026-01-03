"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateRole } from "../action";
import { useRouter } from "next/navigation";

export type Role = "admin" | "manager" | "salesman" | "customer";

export function UpdateRole({
  userId,
  initialRole,
}: {
  userId: string;
  initialRole: Role;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success("Role updated successfully");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  return (
    <Card className="border-none bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Update User Role</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Role</Label>

          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-11 rounded-sm">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="salesman">Salesman</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => mutate({ role, userId })}
          disabled={isPending}
          className="h-11 w-full rounded-sm"
        >
          {isPending ? "Updating..." : "Update Role"}
        </Button>
      </CardContent>
    </Card>
  );
}
