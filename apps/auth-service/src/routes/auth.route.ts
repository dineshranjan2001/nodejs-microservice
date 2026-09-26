import { Router } from "express";
import { getMeController, loginController, registerController } from "../controller/auth.controller";
import { validateBody } from "shared";
import { loginSchema, registerSchema } from "../schema/auth.schema";

const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), registerController);
authRoutes.post('/login',validateBody(loginSchema),loginController);
authRoutes.get('/me',getMeController);

export default authRoutes;
