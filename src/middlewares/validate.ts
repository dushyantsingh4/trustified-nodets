import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Express middleware that validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (and transformed) data.
 * On failure, returns a 400 response with field-level error details.
 *
 * @example
 * router.post("/brands", validate(createBrandSchema), createBrand);
 */
export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
            return;
        }

        req.body = result.data;
        next();
    };
};
