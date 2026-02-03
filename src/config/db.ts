import mongoose from "mongoose";

export const connectDb = async (): Promise<void> => {
    try{
        const MONGO_URI = process.env.MONGO_URI;

        if(!MONGO_URI) {
            throw new Error("MONOG_URI is not defined");
        }

        await mongoose.connect(MONGO_URI);
        console.log("DB connection established");
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.error("Error during db connection", err);
        } else {
            console.error("An unknown error occured while db connection", err);
        }
        process.exit(1);
    }
}

export const disconnectDb = async (): Promise<void> => {
    try{
        await mongoose.connection.close();
        console.log("Db disconnected");
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.error("Error during disconnecting db", err);
        } else {
            console.error("An unknown error during disconnecting db", err);
        }
    }
}