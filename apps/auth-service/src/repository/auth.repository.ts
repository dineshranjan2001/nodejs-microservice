import { getPool } from "shared";
import type { User, UserInput } from "../types/auth.type";

export async function findByEmail(email: string): Promise<User | null> {
  const result = await getPool().query<User>(
    `
        SELECT id,name,email,password_hash,role FROM users WHERE email= $1
        `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(userDetails: UserInput): Promise<User> {
  const result = await getPool().query<User>(
    `
            INSERT INTO users(name,email,password_hash,role)
            VALUES ($1,$2,$3,$4)
            RETURNING id,name,email,password_hash,role,created_at
        `,
    [
      userDetails.name,
      userDetails.email,
      userDetails.password_hash,
      userDetails.role ?? "USER",
    ],
  );
  return result.rows[0]!;
}

export async function findById(userId: string): Promise<User | null> {
  const result = await getPool().query<User>(
    `
        SELECT id,name,email,role FROM users WHERE id= $1
        `,
    [userId ],
  );

  return result.rows[0] ?? null;
}
