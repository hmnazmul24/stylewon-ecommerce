"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="bg-background relative flex h-11 w-20 items-center rounded-full border p-1 transition-colors"
    >
      <div
        className={`bg-primary absolute top-1 left-1 size-9 rounded-full transition-all duration-300 ease-in-out ${
          isDark ? "translate-x-9" : "translate-x-0"
        }`}
      />

      <div className="relative z-10 flex w-full justify-between px-1">
        <div className="flex size-8 items-center justify-center">
          <Sun className={cn("size-4", isDark ? "" : "text-white")} />
        </div>
        <div className="flex size-8 items-center justify-center">
          <Moon className={cn("size-4", isDark ? "text-black" : "")} />
        </div>
      </div>
    </button>
  );
}
