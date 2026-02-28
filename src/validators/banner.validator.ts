import { z } from "zod";

export const createBannerSchema = z.object({
    name: z
        .string({ error: "Banner name is required" })
        .trim()
        .min(2, "Banner name atleast contain 2 characters")
        .max(255, "Banner name cannot exceed 255 characters"),
    image: z
        .string({ error: "Banner image is required" })
        .trim()
        .max(400),
    status: z
        .boolean()
        .default(true)
        .optional(),
    bannerPosition: z
        .enum(["header", "footer"])
        .default("header")
        .optional(),
    productData: z
        .array(
            z.string()
        )
        .optional()
});

export type createBannerInput = z.infer<typeof createBannerSchema>;

