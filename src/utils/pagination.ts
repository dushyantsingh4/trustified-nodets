import mongoose, { Model } from "mongoose";

interface PaginateOptions<T> {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    filter?: mongoose.mongo.Filter<T>;
    select?: string;
}

export const paginate = async<T>(
    model: Model<T>,
    {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        filter = {},
        select = ""
    }: PaginateOptions<T>
) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        model.find(filter).sort(sort).skip(skip).limit(limit).select(select),
        model.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        meta: {
            total,
            page,
            totalPages,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};