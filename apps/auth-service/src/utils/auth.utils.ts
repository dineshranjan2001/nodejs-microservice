import type { User } from "../types/auth.type";

export function convertToCommonResponse(
  userDetails: User,
  showPassword: boolean = false,
) {
  return {
    id: userDetails.id,
    name: userDetails.name,
    email:userDetails.email,
    ...(showPassword ? { password: userDetails.password_hash } : {}),
    role: userDetails.role,
    createdAt: userDetails.created_at,
  };
}
