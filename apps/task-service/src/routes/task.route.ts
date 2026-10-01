import { Router } from "express";
import { createTaskController, deleteTaskController, getTaskByIdController, listTasksController, updateTaskController } from "../controller/task.controller";
import { validateBody } from "shared";
import { createTaskSchema, updateTaskSchema } from "../schema/task.schema"

const taskRoutes = Router();

taskRoutes.post("/create", validateBody(createTaskSchema), createTaskController);
taskRoutes.get("/get-all", listTasksController);
taskRoutes.get('/:taskId', getTaskByIdController);
taskRoutes.put("/:taskId", validateBody(updateTaskSchema),updateTaskController);
taskRoutes.delete("/:taskId", deleteTaskController);

export default taskRoutes;