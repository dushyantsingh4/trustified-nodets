import { z } from "zod";

export const createBrandSchema = z.object({
    brandName: z
        .string({ error: "Brand name is required" })
        .trim()
        .min(2, "Brand name must be at least 2 characters")
        .max(255, "Brand name must not exceed 255 characters"),

    brandImg: z
        .string()
        .max(400, "Brand image URL must not exceed 400 characters")
        .optional(),

    active: z
        .boolean()
        .optional()
        .default(true),

    priority: z
        .number()
        .min(0, "Priority must be at least 0")
        .optional()
        .default(1),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
