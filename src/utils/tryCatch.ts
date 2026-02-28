type Success<T> = [null, T];
type Failure = [Error, null];
type Result<T> = Success<T> | Failure;

/**
 * Wraps an async operation in a try/catch block.
 * Returns a tuple: [data, null] on success, [null, error] on failure.
 *
 * @example
 * const [brands, error] = await tryCatch(Brand.find());
 * if (error) return res.status(500).json({ success: false, message: error.message });
 */
export const tryCatch = async <T>(
    promise: Promise<T>,
    context?: string
): Promise<Result<T>> => {
    try {
        const data = await promise;
        return [null, data];
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`[Error]${context ? ` ${context}:` : ""}`, error.message);
        return [error, null];
    }
};
