import type { Request } from "express";
import { AppError } from "../errors/apperror";

export function getHeaderInfo(req: Request):{
    userId: string; userRole: string
} {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    
    if (typeof userId !== "string" || typeof userRole !== "string") {
        throw new AppError(400,"Required user headers are missing or invalid");
    }
    return {
        userId:userId as string,
        userRole
    }
}
