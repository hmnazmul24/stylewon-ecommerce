import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  searchBy: string;
}

export function DataTableSearch<TData>({
  table,
  searchBy,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="relative">
      <Search className="absolute  size-4 left-2.5 top-2.5 md:top-3.5" />
      <Input
        placeholder={`Search by ${searchBy.toLowerCase()}...`}
        value={(table.getColumn(searchBy)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchBy)?.setFilterValue(event.target.value)
        }
        className="max-w-sm  h-8 md:h-10 pl-8"
      />
    </div>
  );
}
