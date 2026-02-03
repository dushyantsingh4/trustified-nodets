import dotenv from "dotenv";
import app from "./src/app";
import { connectDb } from "./src/config/db";
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    try{
        await connectDb();
        app.listen(PORT, ()=> {
            console.log(`Server started on port: ${PORT}`);
        })
    } catch (err) {
        console.error("Error while starting server", err);
        process.exit(1);
    }
}

startServer();

