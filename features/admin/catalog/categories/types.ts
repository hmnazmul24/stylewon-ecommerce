import { singleCategroyWithProducts } from "./queries";

export type CategoryProductType = Awaited<
  ReturnType<typeof singleCategroyWithProducts>
>["categoryWithProduts"][0]["product"];
