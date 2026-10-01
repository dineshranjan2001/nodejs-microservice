import z from "zod/v3";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required")
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    status: z
        .enum(["OPEN", "CLOSE", "IN_PROGRESS", "RESOLVED"], {
            invalid_type_error: "Invalid status",
        })
});




export type createTaskSchemaInput = z.infer<typeof createTaskSchema>;
export type updateTaskSchemaInput = z.infer<typeof updateTaskSchema>;
