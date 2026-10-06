import type { Request, Response } from "express";
import { asyncHandler, getHeaderInfo, successHandler } from "shared";
import { getListOfWorkflowsService } from "../services/workflow.service";

export const getListOfWorkflowsController = asyncHandler(async(req: Request, res: Response) => {
    const { userId, userRole } = getHeaderInfo(req);
    const taskId = String(req.params.taskId);
    const getListOfWorkflows = await getListOfWorkflowsService(userId, userRole, taskId);
    successHandler(res, 200, true, "List of workflows fetched successfully.", getListOfWorkflows);
});