import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/apperror";


// 1.read the gateway_secret which have been configured in .env
// 2.compare to incoming x-gateway-secret with the configured gateway_secret.
// 3. if match-> next() and if not match-> then it throws forbidden error.
export function requireGatewaySecret(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const excepted = process.env.GATEWAY_SECRET;
    if (!excepted) {
        return next(new AppError(500, "GATEWAY_SECRET is not configure properly."));
    }

    const incomingHeaderRequest = req.header('x-gateway-secret');
    if (!incomingHeaderRequest || incomingHeaderRequest !== excepted) {
        return next(new AppError(403, "forbidden"));
    }
    next();
}