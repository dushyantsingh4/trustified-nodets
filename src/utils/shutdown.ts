import { Server } from "http";
import { disconnectDb } from "../config/db.js";

export const shutdown = (server: Server) => {
    return async (signal: string) => {
        console.log(`\n ${signal} singal received: Shutting server`);
        
        if(server) {
            server.close(async() => {
                console.log("HTTP server closed");
                
                try{
                    await disconnectDb();
                    process.exit(0);
                } catch (err: unknown) {
                    if(err instanceof Error) {
                        console.error("Error during shutting server", err);
                    }
                    process.exit(1);
                }
            })
        } else {
            process.exit(0);
        }
    }
}