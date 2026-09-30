import { Router } from "express";
import { createTaskController } from "../controller/task.controller";

const taskRoutes=Router();

taskRoutes.post("/create",createTaskController);

export default taskRoutes;