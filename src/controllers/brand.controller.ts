import { Request, Response } from "express";
import { Brand } from "../models/brand.model";
import { paginate } from "../utils/pagination";
import { tryCatch } from "../utils/tryCatch";

export const allBrands = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const [result, error] = await tryCatch(
        paginate(Brand, {
            page,
            limit,
            sort: { priority: -1 },
            filter: { active: true },
            select: "brandName brandImg"
        }),
        "Fetching brands"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch brands",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        message: "Brands fetched successfully",
        data: result.data,
        pagination: result.meta
    });
};

export const createBrand = async (req: Request, res: Response) => {
    const { brandName, brandImg, active, priority } = req.body;

    const [brand, error] = await tryCatch(
        Brand.create({ brandName, slug: brandName, brandImg, active, priority }),
        "Creating brand"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create brand",
            data: null
        });
    }

    return res.status(201).json({
        success: true,
        message: "Brand created successfully",
        data: brand
    });
};

export const updateBrand = async (req: Request, res: Response) => {
    const { brandName, brandImg, active, priority } = req.body;
    const { id } = req.params;

    const [brand, error] = await tryCatch(
        Brand.findByIdAndUpdate(id, { brandName, brandImg, active, priority }, { new: true, runValidators: true }),
        "Updating brand"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update brand",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        data: brand
    });
};

export const deleteBrand = async (req: Request, res: Response) => {
    const { id } = req.params;

    const [brand, error] = await tryCatch(
        Brand.findByIdAndDelete(id),
        "Deleting Brand"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete brand",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
        data: brand
    });
}