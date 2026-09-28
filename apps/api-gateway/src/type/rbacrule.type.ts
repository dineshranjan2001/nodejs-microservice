import type { UserRole } from "shared";

export interface ProtectedRoutesRbacTemplate {
    method: string;
    path: string;
    roles: Array<UserRole>;
}

export interface PublicRoutesTemplate {
    method: string;
    path: string;
}