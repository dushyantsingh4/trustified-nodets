import { Schema, model, Types } from "mongoose";
import slugify from "slugify";

type IProductVariant = {
    variantName?: string;
    variantValue?: string;
    variantPrice: number;
    variantStock: number;
}

export interface IProduct {
    productName: string;
    slug: string;
    description?: string;
    price: number;
    discountedPrice?: number;
    category: Types.ObjectId;
    brand: Types.ObjectId;
    images?: string[];
    variants?: IProductVariant[];
    stock: number;
    active: boolean;
    priority: number;
}

const ProductSchema = new Schema<IProduct>({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        maxlength: 255
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0,
    },
    discountedPrice: {
        type: Number,
        min: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category is required"],
        index: true,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Product brand is required"],
        index: true,
    },
    images: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: 0,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
        index: true,
    },
    priority: {
        type: Number,
        default: 1,
        min: 0,
        index: -1,
    }
}, {
    timestamps: true,
});

ProductSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as any;
    if (!update?.productName && !update?.$set?.productName) return next();

    const productName = update.productName || update.$set.productName;
    const baseSlug = slugify(productName, { lower: true, strict: true });

    const ProductModel = this.model;
    let slug = baseSlug;
    let counter = 1;

    while (await ProductModel.exists({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    this.setUpdate({
        ...update,
        slug
    });

    next();
});

export const Product = model<IProduct>("Product", ProductSchema);
