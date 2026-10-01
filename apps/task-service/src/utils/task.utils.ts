import { AppError } from "shared";
import type { Task } from "../types/task.type";
import type { Request } from "express";

export function convertToCommonTaskResponse(taskDetails: Task) {
    return {
        id: taskDetails.id,
        title: taskDetails.title,
        status: taskDetails.status,
        createdBy: taskDetails.created_by,
        createdAt: taskDetails.created_at,
        updatedAt: taskDetails.updated_at
    }
}

export function getUserHeaderInfo(req: Request):{
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