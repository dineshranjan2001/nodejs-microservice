import z from "zod/v3";

export const registerSchema = z.object({
  name: z.string().min(1, "name is required").max(50, "Too much length"),
  email: z.string().email("valid email is required"),
  password: z.string().min(6, "password is required"),
  role: z
    .enum(["ADMIN", "USER"], {
      invalid_type_error: "Invalid role",
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("valid email is required"),
  password: z.string().min(6, "password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
