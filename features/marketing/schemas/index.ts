import { z } from "zod";

export const billingInfoSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(255, "Full name cannot exceed 255 characters"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number cannot exceed 20 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),

  districtId: z.string().min(2, "District is required"),

  upazilaId: z.string().min(2, "Area is required"),

  address: z.string().min(5, "Address is too short"),

  email: z
    .email("Invalid email format")
    .optional()
    .or(z.literal("").optional()),

  note: z.string().optional(),
});

export type BillingSchemaType = z.infer<typeof billingInfoSchema>;
