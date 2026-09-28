export type UserRole = "USER" | "ADMIN";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
