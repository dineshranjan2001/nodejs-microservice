export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}

export interface JwtPayload {
  userId: string;
  role: string;
}
