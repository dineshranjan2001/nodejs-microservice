import { Router } from "express";
import { getListOfWorkflowsController } from "../controller/workflow.controller";

const taskWorkflowApis=Router();
taskWorkflowApis.get("/:taskId/workflows",getListOfWorkflowsController);


export default taskWorkflowApis;