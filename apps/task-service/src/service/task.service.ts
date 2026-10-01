import { AppError } from "shared";
import { createTask, deleteTaskById, getTaskById, listTasks, updateTask } from "../repository/task.repository";
import type { CreateTaskInput, ListTaskQueryInput, UpdateTaskInput } from "../types/task.type";
import { convertToCommonTaskResponse } from "../utils/task.utils";


export async function createTaskService(taskDetails: CreateTaskInput) {
    const createdTaskDetails = await createTask(taskDetails);
    return convertToCommonTaskResponse(createdTaskDetails);
}

export async function listTasksService(queryInput: ListTaskQueryInput) {
    const getListTasks = await listTasks(queryInput);
    const commonListTask = getListTasks.map(task => convertToCommonTaskResponse(task));
    return commonListTask;
}

export async function getTaskByIdService(userId: string, userRole: string, taskId: string) {
    const getTaskDetails = await getTaskById(taskId);
    if (!getTaskDetails) {
        throw new AppError(404, "No Task found");
    }
    if (userRole !== 'ADMIN' && getTaskDetails.created_by !== userId) {
        throw new AppError(403, "Forbidden");
    }
    return convertToCommonTaskResponse(getTaskDetails);
}

export async function updateTaskService(userId: string, userRole: string, taskId: string, updatedTaskData: UpdateTaskInput) {
    const getTaskDetails = await getTaskById(taskId);
    if (!getTaskDetails) {
        throw new AppError(404, "No Task found");
    }
    if (userRole !== "ADMIN" && getTaskDetails.created_by !== userId) {
        throw new AppError(403, "Forbidden");
    }

    const updatedTaskDetails = await updateTask(taskId, updatedTaskData);
    return convertToCommonTaskResponse(updatedTaskDetails);
}

export async function deleteTaskService(userRole: string, taskId: string) {
    const getTaskDetails = await getTaskById(taskId);
    if (!getTaskDetails) {
        throw new AppError(404, "No Task found");
    }
    if (userRole !== "ADMIN") {
        throw new AppError(400, "You can't delete this task.");
    }

    const isDeleted = await deleteTaskById(taskId);
    return isDeleted;
}