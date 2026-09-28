import jwt from "jsonwebtoken";
import { AppError } from "../errors/apperror";
import type { JwtPayload } from "./types";

function extractJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(400, "invalid jwt secret or not set properly.");
    return secret;
}

export function generateToken(payload: JwtPayload): string {
    const secret = extractJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn
    } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
    const decodeToken = jwt.verify(token, extractJwtSecret());
    if (
        typeof decodeToken !== 'object'
        || decodeToken === null
        || typeof decodeToken.userId !== 'string'
        || decodeToken.role !== "USER" && decodeToken.role !== "ADMIN"
    ) {
        throw new AppError(400, "Invalid token payload")
    }
    return {
        userId: decodeToken.userId,
        role: decodeToken.role
    }
}