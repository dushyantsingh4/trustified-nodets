import { z } from "zod";

export const createCategorySchema = z.object({
    categoryName: z
        .string({ error: "Category name is required" })
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(255, "Category name must not exceed  255 characters"),
    categoryImg: z
        .string()
        .max(400, "Category image URL must not exceed 400 characters")
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

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;