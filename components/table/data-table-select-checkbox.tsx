import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../../../../for-portfolio/tew-youth-dev-resource/src/components/ui/checkbox";

interface CheckBoxHeaderProps<TData> {
  table: Table<TData>;
}

export function CheckBoxHeader<TData>({ table }: CheckBoxHeaderProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

interface CheckBoxCellProps<TData> {
  row: Row<TData>;
}

export function CheckBoxCell<TData>({ row }: CheckBoxCellProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
