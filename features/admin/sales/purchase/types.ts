import { searchAnyProducts } from "./actions";

export type SearchAnyProductsType = Awaited<
  ReturnType<typeof searchAnyProducts>
>["products"][number];
