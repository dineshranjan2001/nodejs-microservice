import type { UserRole } from "shared";
import type { ProtectedRoutesRbacTemplate, PublicRoutesTemplate } from "./type/rbacrule.type";

export const publicRoutes:PublicRoutesTemplate[] = [
    {
        method: "POST",
        path: "/auth/register"
    },
    {
        method: "POST",
        path: "/auth/login"
    },
] as const;

const protectedRoutes: ProtectedRoutesRbacTemplate[] = [
    {
        method: "GET",
        path: "/auth/me",
        roles: ['USER', 'ADMIN']
    }
]


// utility function for match the route path
function matchPath(pattern: string, actual: string): boolean {

    // normal pattern
    if (pattern == actual) {
        return true;
    }
    const patternParts = pattern.split('/');
    const actualParts = pattern.split('/');
    if (patternParts.length !== actualParts.length) {
        return false;
    }

    // dynamic routes (:id, :username)
    return patternParts.every((part, index) => part.startsWith(":") || part === actualParts[index]);
}

export function isPublicRoute(method: string, path: string): boolean {
    return publicRoutes.some(route => route.method === method && matchPath(route.path, path));
}

export function getAllowedRoles(method: string, path: string): UserRole[] | null {
    const rules = protectedRoutes.find(currentRule =>
        currentRule.method === method && matchPath(currentRule.path, path)
    );
    return rules?.roles ?? null;
}