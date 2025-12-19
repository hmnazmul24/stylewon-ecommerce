import { db } from "@/drizzle/db";
import { defaultDeliveryCharge } from "@/drizzle/schema";
import { DeliveryCharge } from "../components/delivery-charge";
import { BannerBox } from "../components/banner-box";

export default async function ConsolePage() {
  const [res] = await db.select().from(defaultDeliveryCharge);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DeliveryCharge
        insideDhaka={res.insideDhaka.toString()}
        outsideDhaka={res.outsideDhaka.toString()}
      />
      <BannerBox />
    </div>
  );
}
