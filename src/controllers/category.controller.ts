import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { paginate } from "../utils/pagination";
import { Category } from "../models/category.model";

export const fetchCategory = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const [error, category] = await tryCatch(
        paginate(Category, {
            page,
            limit,
            sort: { priority: -1 },
            filter: { active: true },
            select: "categoryName slug categoryImg"
        }),
        "Fetching categories"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: category
    });
}

export const createCategory = async (req: Request, res: Response) => {
    const { categoryName, categoryImg, active, priority } = req.body;

    const [error, category] = await tryCatch(
        Category.create({ categoryName, categoryImg, active, priority }),
        "Creating category"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to create category",
            data: null
        });
    }

    return res.status(201).json({
        success: true,
        msg: "Category created successfully",
        data: category
    });
};

export const updateCategory = async (req: Request, res: Response) => {
    const { categoryName, categoryImg, active, priority } = req.body;
    const { id } = req.params;

    const [error, category] = await tryCatch(
        Category.findByIdAndUpdate(id, { categoryName, categoryImg, active, priority }, { new: true, runValidators: true }),
        "Updating Category"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to update category",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        msg: "Category updated successfully",
        data: category
    });
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, category] = await tryCatch(
        Category.findByIdAndDelete(id),
        "Deleting Category"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to delete category",
            data: null
        });
    }

    return res.status(200).json({
        success: true,
        msg: "Category deleted successfully",
        data: category
    });
};