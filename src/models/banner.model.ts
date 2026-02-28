import { Schema, Types, model } from "mongoose";

interface IBanner {
    name: string;
    image: string;
    status: boolean;
    bannerPosition: "header" | "footer";
    productData: Types.ObjectId[];
}

const bannerSchema = new Schema<IBanner>({
    name: {
        type: String,
        required: [true, "Banner name is required"],
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    image: {
        type: String,
        required: [true, "Banner image is required"],
        maxlength: 400,
    },
    status: {
        type: Boolean,
        default: true,
    },
    bannerPosition: {
        type: String,
        enum: ["header", "footer"],
        default: "header",
    },
    productData: {
        type: [{ type: Types.ObjectId, ref: "Product" }],
        default: [],
    }
}, { timestamps: true });

export const Banner = model<IBanner>("Banner", bannerSchema);