export interface TaskWorkflows {
    id: string;
    task_id: string;
    event_type: string;
    message: string;
    created_by: string;
    created_at: Date;
}

export interface TaskWorkflowsInput {
    taskId: string;
    eventType: string;
    message: string;
    createdBy: string;
}

export interface DomainEvent {
    eventType?: string;
    taskId?: string;
    userId?: string;
    message?: string;
}