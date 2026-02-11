import { Schema, model, Model } from "mongoose";
import slugify from "slugify";

export interface IBrand {
    brandName: string;
    slug: string;
    brandImg?: string;
    active: boolean;
    priority: number;
}

const BrandSchema = new Schema<IBrand>({
    brandName: {
        type: String,
        required: [true, "Brand name is required"],
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
    brandImg: {
        type: String,
        maxlength: 400,
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
        index: -1
    }
}, {
    timestamps: true,
});

BrandSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as any;
    if (!update?.brandName && !update?.$set?.brandName) return next();

    const brandName = update.brandName || update.$set.brandName;
    const baseSlug = slugify(brandName, { lower: true, strict: true });

    const BrandModel = this.model;
    let slug = baseSlug;
    let counter = 1;

    while (await BrandModel.exists({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    this.setUpdate({
        ...update,
        slug
    });

    next();
});


export const Brand = model<IBrand>("Brand", BrandSchema);