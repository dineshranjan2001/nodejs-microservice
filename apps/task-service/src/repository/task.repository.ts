import { getPool } from "shared";
import type { CreateTaskInput, ListTaskQueryInput, Task } from "../types/task.type";

export async function createTask(taskDetails: CreateTaskInput): Promise<Task> {
    const result = await getPool().query<Task>(
        `
            INSERT INTO tasks(title,created_by) VALUES($1,$2)
            RETURNING id,title,status,created_by,created_at,updated_at
        `,
        [taskDetails.title, taskDetails.created_by]
    );
    return result.rows[0]!;
}

export async function listTasks(queryInput: ListTaskQueryInput): Promise<Array<Task> | []> {
    if (queryInput.role === "ADMIN") {
        const result = await getPool().query<Task>(
            `
        SELECT id,title,status,created_by,created_at,updated_at FROM tasks
        ORDER BY created_at=DESC;
        `,
            [queryInput.userId]
        );
        return result.rows ?? [];
    }
    const result = await getPool().query<Task>(
        `
        SELECT id,title,status,created_by,created_at,updated_at FROM tasks WHERE 
        created_by=$1
        ORDER BY created_at=DESC;
        `,
        [queryInput.userId]
    );
    return result.rows ?? [];
}

export async function getTaskById(taskId: string): Promise<Task | null> {
    const result = await getPool().query<Task>(
        `
         SELECT id,title,status,created_by,created_at,updated_at FROM tasks WHERE id=$1;
        `,
        [taskId]
    );
    return result.rows[0] ?? null;
}

export async function deleteTaskById(taskId: string): Promise<boolean> {
    const result = await getPool().query<Task>(
        `DELETE FROM tasks WHERE id=$1`, [taskId]
    );
    return (result.rowCount ?? 0) > 0 ? true : false;
}