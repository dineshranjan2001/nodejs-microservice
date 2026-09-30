import { createTask, listTasks } from "../repository/task.repository";
import type { CreateTaskInput, ListTaskQueryInput } from "../types/task.type";


export async function createTaskService(taskDetails: CreateTaskInput) {
    const createdTaskDetails = await createTask(taskDetails);
    return createdTaskDetails;
}

export async function listTasksService(queryInput: ListTaskQueryInput) {
    const getListTasks = await listTasks(queryInput);
    return getListTasks;
}