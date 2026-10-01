import type { Request, Response } from "express";
import { asyncHandler, successHandler } from "shared";
import { createTaskService, deleteTaskService, getTaskByIdService, listTasksService, updateTaskService } from "../service/task.service";
import { getUserHeaderInfo } from "../utils/task.utils";


export const createTaskController = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = getUserHeaderInfo(req);
    const createdTaskDetails = await createTaskService({ ...req.body, created_by: userId });
    successHandler(res, 201, true, "Task created successfully", createdTaskDetails);
});

export const listTasksController = asyncHandler(async (req: Request, res: Response) => {
    const { userId, userRole } = getUserHeaderInfo(req);
    const getListTasks = await listTasksService({
        userId,
        role: userRole
    });
    successHandler(res, 200, true, "List of task fetched successfully", getListTasks);
});

export const getTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { userId, userRole } = getUserHeaderInfo(req);
    const taskId = String(req.params.taskId);
    const getTaskDetails = await getTaskByIdService(userId, userRole, taskId);
    successHandler(res, 200, true, "Task fetched successfully", getTaskDetails);
});

export const updateTaskController = asyncHandler(async (req: Request, res: Response) => {
    const { userId, userRole } = getUserHeaderInfo(req);
    const taskId = String(req.params.taskId);
    const updatedTaskDetails = await updateTaskService(userId, userRole, taskId,req.body);
    successHandler(res, 200, true, "Task updated successfully", updatedTaskDetails);
});

export const deleteTaskController = asyncHandler(async (req: Request, res: Response) => {
    const { userRole } = getUserHeaderInfo(req);
    const taskId = String(req.params.taskId);
    const isDeleted = await deleteTaskService(userRole, taskId);
    successHandler(res, 200, true, "Task deleted successfully", isDeleted);
});
