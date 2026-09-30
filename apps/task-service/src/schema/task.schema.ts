import z from "zod/v3";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required")
});


export type CreateTaskSchemaInput = z.infer<typeof createTaskSchema>;
