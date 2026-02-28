import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }
}