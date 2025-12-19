"use client";

import { Input } from "@/components/ui/input";
import { ComponentProps, ReactNode, useState } from "react";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  children,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & {
  children?: ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...props} />
      <Button
        className="absolute top-0.5 right-0.5 opacity-60"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        variant={"ghost"}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
