import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

declare var process: any;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuciin_super_secret_key_2024") as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        next();
    };
};
