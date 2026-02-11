import { Schema, model } from "mongoose";
import slugify from "slugify";

export interface ICategory {
    categoryName: string;
    slug: string;
    categoryImg?: string;
    active: boolean;
    priority: number;
}

const CategorySchema = new Schema<ICategory>({
    categoryName: {
        type: String,
        required: [true, "Category name is required"],
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
    categoryImg: {
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

CategorySchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as any;
    if (!update?.categoryName && !update?.$set?.categoryName) return next();

    const categoryName = update.categoryName || update.$set.categoryName;
    const baseSlug = slugify(categoryName, { lower: true, strict: true });

    const CategoryModel = this.model;
    let slug = baseSlug;
    let counter = 1;

    while (await CategoryModel.exists({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    this.setUpdate({
        ...update,
        slug
    });

    next();
});

export const Category = model<ICategory>("Category", CategorySchema);