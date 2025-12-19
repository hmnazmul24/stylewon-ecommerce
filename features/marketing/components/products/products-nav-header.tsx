"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Delete, Search } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

const categoryParser = parseAsArrayOf(parseAsString).withDefault([]);

export default function ProductsNavHeader() {
  const [search, setSearch] = useQueryState("search");
  const [category, setCategory] = useQueryState("category", categoryParser);

  return (
    <div className="m-auto max-w-5xl px-2 py-4 lg:px-0">
      <div className="my-2 space-x-1">
        {category.map((cat) => (
          <Badge
            onClick={() => setCategory((prev) => prev.filter((v) => v !== cat))}
            key={cat}
          >
            {cat} <Delete className="text-destructive" />
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
          className="py-5 pl-10"
          placeholder="Search here..."
        />
        <Search className="absolute top-3 left-2 size-5" />
      </div>
    </div>
  );
}
