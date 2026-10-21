// apps/web/src/features/auth/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  twoFactorToken: z.string().length(6, "2FA OTP must be 6 digits").optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"]).default("CONSUMER"),
  referredBy: z.string().optional(),
});

export const demoLoginSchema = z.object({
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
});

export const setup2FaSchema = z.object({
  token: z.string().length(6, "2FA token must be 6 digits"),
  secret: z.string().min(10, "Invalid secret key"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DemoLoginInput = z.infer<typeof demoLoginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type Setup2FaInput = z.infer<typeof setup2FaSchema>;
