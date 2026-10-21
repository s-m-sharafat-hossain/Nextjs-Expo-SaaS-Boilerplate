import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "PROVIDER", "CONSUMER"]);
export type RoleType = z.infer<typeof RoleEnum>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: RoleEnum.default("CONSUMER"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept terms"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: RoleEnum,
  plan: z.string().default("Free"),
  credits: z.number().default(100),
  image: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  kycStatus: z.enum(["PENDING", "VERIFIED", "REJECTED", "UNSUBMITTED"]).default("UNSUBMITTED"),
  biometricEnabled: z.boolean().default(false),
  wallet: z.object({
    balance: z.number().default(0),
    pendingBalance: z.number().default(0),
    currency: z.string().default("USD"),
  }).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
