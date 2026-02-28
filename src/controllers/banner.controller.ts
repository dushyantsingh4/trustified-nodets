import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { Banner } from "../models/banner.model";
import { paginate } from "../utils/pagination";
import fs from "fs";
import path from "path";

const deleteLocalImage = async (filename: string) => {
    if (!filename) return;
    const imagePath = path.join(process.cwd(), "uploads", filename);
    try {
        await fs.promises.unlink(imagePath);
    } catch (err) {
        console.log("Failed to delete image:", err);
    }
};

export const createBanner = async (req: Request, res: Response) => {
    const { name, status, bannerPosition, productData } = req.body;
    let image = req.body.image;

    if (req.file) {
        image = req.file.filename;
    }

    const [error, banner] = await tryCatch(
        Banner.create({ name, image, status, bannerPosition, productData }),
        "Creating Banner"
    );

    if (error) {
        if (req.file) {
            await deleteLocalImage(req.file.filename);
        }
        return res.status(500).json({
            success: false,
            msg: "Failed to create banner",
            data: null
        });
    }

    return res.status(201).json({
        success: true,
        msg: "Banner created successfully",
        data: banner
    });
}

export const fetchBanners = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const [error, banners] = await tryCatch(
        paginate(Banner, {
            page,
            limit,
            sort: { createdAt: -1 },
            filter: { status: true },
            select: "name image bannerPosition productData"
        }),
        "Fetching Banners"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to fetch banners",
            data: null
        })
    }

    return res.status(200).json({
        success: true,
        msg: "Banners fetched successfully",
        data: banners
    });
}

export const updateBanner = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, status, bannerPosition, productData } = req.body;
    let image = req.body.image;

    if (req.file) {
        image = req.file.filename;
    }

    // Find the existing banner to get the old image path
    const oldBanner = await Banner.findById(id);
    if (!oldBanner) {
        if (req.file) {
            await deleteLocalImage(req.file.filename);
        }
        return res.status(404).json({
            success: false,
            msg: "Banner not found",
            data: null
        });
    }

    const [error, banner] = await tryCatch(
        Banner.findByIdAndUpdate(id, { name, image, status, bannerPosition, productData }, { new: true }),
        "Updating Banner"
    );

    if (error) {
        if (req.file) {
            await deleteLocalImage(req.file.filename);
        }
        return res.status(500).json({
            success: false,
            msg: "Failed to update Banner",
            data: null
        });
    }

    // Since update was successful, delete the old image if a new one was uploaded
    if (req.file && oldBanner.image) {
        await deleteLocalImage(oldBanner.image);
    }

    return res.status(200).json({
        success: true,
        msg: "Banner udpated successfully",
        data: banner
    });
};

export const deleteBanner = async (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, banner] = await tryCatch(
        Banner.findByIdAndDelete(id),
        "Deleting Banner"
    );

    if (error) {
        return res.status(500).json({
            success: false,
            msg: "Failed to delete Banner",
            data: null
        });
    }

    if (!banner) {
        return res.status(404).json({
            success: false,
            msg: "Banner not found",
            data: null
        });
    }

    // Delete the banner's image
    if (banner.image) {
        await deleteLocalImage(banner.image);
    }

    console.log(banner);
    return res.status(200).json({
        success: true,
        msg: "Banner deleted successfully",
        data: banner
    });
}