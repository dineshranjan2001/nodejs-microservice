import type { Request,Response } from "express"
import {AppError, asyncHandler, successHandler} from "shared"
import { getMe, login, register } from "../service/auth.service";


export const registerController=asyncHandler(async(req:Request,res:Response)=>{
    const registerUserDetails=await register(req.body);
    successHandler(res,201,true,"User created successfully",registerUserDetails);
});

export const loginController=asyncHandler(async(req:Request,res:Response)=>{
    const loginUserDetails=await login(req.body);
    successHandler(res,201,true,"User login in successfully",loginUserDetails);
});

export const getMeController=asyncHandler(async(req:Request,res:Response)=>{
    console.log("enterrr into the getMeController ",req.header('x-user-id'));
    const userId=req.header('x-user-id');
    if(!userId){
        throw new AppError(401,'Missing x-user-id');
    }

    const userDetails=await getMe(userId);
    successHandler(res,201,true,"User fetch successfully",userDetails);
});