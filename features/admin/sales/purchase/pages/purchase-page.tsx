import { SelectProducts } from "../components/select-products";
import { SelectUser } from "../components/select-user";

export function PurchasePage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section>
        <SelectUser />
      </section>
      <section>
        <SelectProducts />
      </section>
    </div>
  );
}
