export type TaskStatus = "OPEN" | "CLOSE" | "IN_PROGRESS" | "RESOLVED";

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTaskInput {
    title: string;
    created_by: string;
}

export interface ListTaskQueryInput {
     userId?: string;
    role: string
}