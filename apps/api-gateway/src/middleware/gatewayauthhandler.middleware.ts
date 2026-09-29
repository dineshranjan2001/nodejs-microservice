import type { Request, Response, NextFunction } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";


const INDENTITY_HEADER = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const;


// utility function for stripe the identity headers
function stripeIndentityHeaders(req: Request) {
    for (const header of INDENTITY_HEADER) {
        delete req.headers[header];
    }
}

//utility function for validate the client header
// function verifyHeaders(req: Request, userId: string, role: string) {
//     const clientUserId = req.headers['x-user-id'];
//     console.log("clientUserId",clientUserId);
//     const clientRole = req.headers['x-user-role'];

//     if ((clientUserId !== undefined && clientUserId !== userId) || (clientRole !== undefined && clientRole !== role)) {
//         throw new AppError(400, "Invalid user identity");
//     }
// }

// utility function for attach the gateway secret
function attachGatewaySecret(req: Request) {
    const gatewaySecret = process.env.GATEWAY_SECRET;
    if (!gatewaySecret) {
        throw new AppError(500, "gateway secret is not set/configured/missing");
    }
    req.headers['x-gateway-secret'] = gatewaySecret;
}

// utilify function for get the request path
function getRequestPath(req: Request) {
    const combinedPath = `${req.baseUrl}${req.path}`;
    if (combinedPath.length > 1 && combinedPath.endsWith('/')) {
        return combinedPath.slice(0, 1);
    }
    return combinedPath || "/";
}

// utilify function for attach the identity header
function attachIdentityHeaders(req: Request, userId: string, role: string) {
    req.headers['x-user-id'] = userId;
    req.headers['x-user-role'] = role;
}


//run on every request before the proxy forward the request to the corresponding services.
export function gatewayAuthHandler(req: Request, _res: Response, next: NextFunction) {

    try {
        // stripe/remove the identity headers.
        stripeIndentityHeaders(req);

        // attch the gateway secret
        attachGatewaySecret(req);

        // check the path is a public route or not
        // if it is public auth then skip the auth otherwise check the auth.
        const path = getRequestPath(req);

        // if it returns true then skip the auth
        if (isPublicRoute(req.method, path)) {
            return next();
        }

        // check the Bearer Authentication Token from header.
        const authHeader = req.header('authorization');
        if (!authHeader || !authHeader?.startsWith("Bearer ")) {
            throw new AppError(401, "Missing header or invalid auth token.");
        }
        const token = authHeader.slice("Bearer ".length).trim();
        const payload = verifyToken(token);



        // RBAC -> is the role allowed on this method and this path.
        const allowedRoles = getAllowedRoles(req.method, path);
        if (!allowedRoles) {
            throw new AppError(404, "Route not found.");
        }

        // check the access for the routes 
        if (!allowedRoles.includes(payload.role)) {
            throw new AppError(403, "Forbidden, you do not have access to this route.");
        }

        
        // attach the identity headers.
        attachIdentityHeaders(req, payload.userId, payload.role);
       
        return next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        }
        // if the jwt.verify() fails verifying the token then only return this error message.
        return next(new AppError(401, "Invalid or expired token"));
    }
}