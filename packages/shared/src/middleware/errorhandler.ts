import type { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/apperror.js";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Internal server error";

    // logger error also going to add
    

    return res.status(statusCode).json({
        success: false,
        message
    });
}