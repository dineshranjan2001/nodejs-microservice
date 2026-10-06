import { getPool } from "shared";
import type { TaskWorkflows, TaskWorkflowsInput } from "../types/workflow.type";

export async function createTaskWorkflows(taskWorkFlowData: TaskWorkflowsInput): Promise<TaskWorkflows> {
    const result = await getPool().query<TaskWorkflows>(
        `
            INSERT INTO task_workflows(task_id,event_type,message,created_by) VALUES($1,$2,$3,$4)
            RETURNING id,task_id,event_type,message,created_by,created_at;
        `, [taskWorkFlowData.taskId, taskWorkFlowData.eventType, taskWorkFlowData.message, taskWorkFlowData.createdBy]
    );
    return result.rows[0]!;
}

export async function findTaskById(
    taskId: string,
): Promise<{ id: string; created_by: string } | null> {
    const result = await getPool().query<{ id: string; created_by: string }>(
        `
            SELECT id,created_by FROM tasks WHERE id=$1
        `,
        [taskId],
    );

    return result.rows[0] ?? null;
}

export async function getListWorkflowsByTaskId(taskId: string): Promise<TaskWorkflows[] | []> {
    const result = await getPool().query<TaskWorkflows>(
        `SELECT id,task_id,event_type,message,created_by,created_at FROM task_workflows WHERE task_id=$1`, [taskId]
    );
    return result.rows || [];
}

