import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.type";
import { AppError } from "shared";


function extractJwtSecret():string{
    const secret=process.env.JWT_SECRET;
    if(!secret) throw new AppError(400,"invalid jwt secret or not set properly.");
    return secret;
} 

export function generateToken(payload:JwtPayload):string{
   const secret = extractJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn
    } as jwt.SignOptions);
}