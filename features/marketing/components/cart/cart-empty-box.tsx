import { Ban } from "lucide-react";

export function CartEmptyBox() {
  return (
    <div className="flex items-center justify-center space-x-2 rounded-md border border-dashed py-20 opacity-50">
      <span>Your cart is empty</span> <Ban />
    </div>
  );
}
