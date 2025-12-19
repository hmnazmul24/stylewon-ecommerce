"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter } from "next/navigation";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { getCategories } from "../../server/queries";

const categoryParser = parseAsArrayOf(parseAsString).withDefault([]);

export function CategoryCheckBox({
  data,
}: {
  data: Awaited<ReturnType<typeof getCategories>>;
}) {
  const router = useRouter();
  const [categories, setCategories] = useQueryState("category", categoryParser);
  const pathname = usePathname();

  const toggleCategory = (value: string) => {
    if (!pathname.startsWith("/products")) {
      router.push(`/products?category=${value}`);
    } else {
      setCategories(
        (prev) =>
          prev.includes(value)
            ? prev.filter((c) => c !== value) // uncheck
            : [...prev, value], // check
      );
    }
  };

  return (
    <div className="p-3">
      {data.map((cat) => {
        const checked = categories.includes(cat.categoryName);

        return (
          <div
            key={cat.id}
            onClick={() => toggleCategory(cat.categoryName)}
            className="hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-md px-3 py-2"
          >
            <Checkbox checked={checked} />
            <span>{cat.categoryName}</span>
          </div>
        );
      })}
    </div>
  );
}
