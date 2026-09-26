import { AppError } from "shared";
import type { LoginInput, RegisterInput } from "../schema/auth.schema";
import { createUser, findByEmail, findById } from "../repository/auth.repository";
import bcrypt, { compareSync } from "bcryptjs";
import { convertToCommonResponse } from "../utils/auth.utils";
import { generateToken } from "../utils/jwt.utils";

export async function register(userDetails: RegisterInput) {
  const getExistUserDetails = await findByEmail(userDetails.email);
  if (getExistUserDetails) {
    throw new AppError(409, "User already exists.");
  }

  const hashedPassword = await bcrypt.hash(userDetails.password, 10);
  const registeredUserDetails = await createUser({
    name: userDetails.name,
    email: userDetails.email,
    password_hash: hashedPassword,
    role: userDetails.role ? userDetails.role : "USER",
  });
  return convertToCommonResponse(registeredUserDetails);
}

export async function login(userDetails: LoginInput) {
  const existingUser = await findByEmail(userDetails.email);

  if (!existingUser) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(
    userDetails.password,
    existingUser.password_hash,
  );

  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: existingUser.id,
    role: existingUser.role,
  });

  return {
    token,
    user: convertToCommonResponse(existingUser),
  };
}

export async function getMe(userId: string) {
  const getUserDetails = await findById(userId);
  if (!getUserDetails) {
    throw new AppError(404, "User not found");
  }

  return convertToCommonResponse(getUserDetails);
}
