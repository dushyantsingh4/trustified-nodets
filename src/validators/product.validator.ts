import { z } from "zod";

export const createProductSchema = z.object({
    productName: z
        .string({ error: "Product name is required" })
        .trim()
        .min(2, "Minimum length for product name should be 2 characters")
        .max(255, "Product name cannot exceed 255 characters")
})