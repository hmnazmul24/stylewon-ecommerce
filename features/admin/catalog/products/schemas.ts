// schemas/product.ts
import { z } from "zod";

export const addProductSchema = z.object({
  //required
  name: z
    .string()
    .min(5, "Product name must be at least 5 characters.")
    .max(255, "Product name must be at most 255 characters."),

  price: z
    .string()
    .min(2, "Price must exceed 10 units.")
    .max(100000, "Price cannot exceed 100000 units."),
  images: z.array(z.string()).nonempty("You must select at least 1 image"),

  //optional

  profit: z.string(),
  margin: z.string(),
  description: z.string().optional(),
  costOfGoods: z.string().optional(),
  stocks: z.string().optional(),
  shippingWeight: z.string().optional(),

  // extra fields

  sizes: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  colors: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      hexColor: z.string().optional(),
    }),
  ),
});

export type AddProductSchemaType = z.infer<typeof addProductSchema>;
