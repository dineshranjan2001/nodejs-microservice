import type { TaskWorkflows } from "../types/workflow.type";

export function convertToCommonTaskWorkflowsResponse(taskWorkFlowData: TaskWorkflows) {
    return {
        id: taskWorkFlowData.id,
        taskId: taskWorkFlowData.task_id,
        eventType: taskWorkFlowData.event_type,
        message: taskWorkFlowData.message,
        createdBy: taskWorkFlowData.created_by,
        createdAt: taskWorkFlowData.created_at
    }
}