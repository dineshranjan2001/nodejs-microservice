import type { Response } from "express";

export function successHandler(
    res: Response,
    statusCode: number = 200,
    success: boolean = true,
    message: string = "Data retrived successfully.",
    data?: unknown,

) {
    return res.status(statusCode).json({
        statusCode,
        success,
        message,
        data
    });
}


export function failureHandler(
    res: Response,
    statusCode: number = 400,
    success: boolean = false,
    message: string = "Bad Request"
) {
    return res.status(statusCode).json({
        statusCode,
        success,
        message
    });
}