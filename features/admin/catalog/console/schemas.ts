import z from "zod";

export const deliverySchema = z.object({
  insideDhaka: z.string().min(1, "Required"),
  outsideDhaka: z.string().min(1, "Required"),
});
