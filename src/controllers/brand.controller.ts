import { Request, Response } from "express";
import { Brand } from "../models/brand.model";

export const allBrands = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [brands, total] = await Promise.all([
            Brand.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Brand.countDocuments()
        ]);

        return res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: brands,
            pagination: {
                current_page: page,
                limit,
                total_pages: Math.ceil(total / limit),
                total_items: total
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch brands",
            data: null
        });
    }
};