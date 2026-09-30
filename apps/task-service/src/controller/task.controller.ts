import type { Request,Response } from "express";
import { asyncHandler, successHandler } from "shared";
import { createTaskService, listTasksService } from "../service/task.service";
import { getUserHeaderInfo } from "../utils/task.utils";


export const createTaskController=asyncHandler(async(req:Request,res:Response)=> {
    const {userId}=getUserHeaderInfo(req);
    const createdTaskDetails=await createTaskService({...req.body,created_by:userId});
    successHandler(res,201,true,"Task created successfully",createdTaskDetails); 
});

export const listTasksController=asyncHandler(async(req:Request,res:Response)=>{
    const {userId,userRole}=getUserHeaderInfo(req);
    const getListTasks=await listTasksService({
        userId ,
        role:userRole
    });
    successHandler(res,201,true,"List of task fetched successfully",getListTasks); 
});

export const getTaskController=asyncHandler(async(req:Request,res:Response)=>{
    
});