// apps/web/src/features/auth/auth.schema.ts
import { z } from "zod";

// Common password blacklist
export const COMMON_PASSWORDS = new Set([
  "password123456",
  "123456789012",
  "qwerty123456",
  "admin123456!",
  "welcome12345!",
  "letmein12345!",
  "changeme1234!",
  "password1234!",
  "saasflow1234!",
  "masterflow123!",
]);

/**
 * Strict enterprise password validation regexes:
 * - Minimum 12 characters
 * - At least 1 uppercase
 * - At least 1 lowercase
 * - At least 1 number
 * - At least 1 special character
 */
export const strongPasswordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one numeric digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine(
    (pwd) => !COMMON_PASSWORDS.has(pwd.toLowerCase()),
    "This password is too common and insecure. Please choose a stronger password."
  );

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  twoFactorToken: z.string().length(6, "2FA OTP must be 6 digits").optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: strongPasswordSchema,
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"]).default("CONSUMER"),
  referredBy: z.string().optional(),
});

export const demoLoginSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "PROVIDER", "CONSUMER"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
  address: z.string().optional(),
  governmentId: z.string().optional(),
});

export const setup2FaSchema = z.object({
  token: z.string().length(6, "2FA token must be 6 digits"),
  secret: z.string().min(10, "Invalid secret key"),
});

// Phone Verification Schemas
export const sendPhoneCodeSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Invalid international phone number format (E.164)"),
});

export const verifyPhoneSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Invalid international phone number format"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

// Biometric Auth Schemas (Mobile / WebAuthn)
export const enrollBiometricSchema = z.object({
  credentialId: z.string().min(10),
  publicKey: z.string().min(10),
  deviceName: z.string().default("Primary Device"),
});

export const verifyBiometricSchema = z.object({
  userId: z.string().min(1),
  credentialId: z.string().min(10),
  signature: z.string().min(10),
  challenge: z.string().min(10),
});

// Magic Link Schemas
export const magicLinkRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const magicLinkVerifySchema = z.object({
  token: z.string().min(16, "Invalid magic link token"),
});

// Account Lockout & Recovery Schemas
export const unlockAccountSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  unlockToken: z.string().min(16),
});

export const setupSecurityQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(5),
        answer: z.string().min(2),
      })
    )
    .min(2, "Must set up at least 2 security questions")
    .max(5),
});

export const verifySecurityQuestionsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

// OAuth 2.0 Server Schemas
export const createOAuthClientSchema = z.object({
  name: z.string().min(2).max(100),
  redirectUris: z.array(z.string().url()).min(1),
  scopes: z.array(z.string()).default(["read"]),
});

export const oauthAuthorizeSchema = z.object({
  clientId: z.string().min(1),
  redirectUri: z.string().url(),
  responseType: z.literal("code"),
  scope: z.string().default("read"),
  state: z.string().optional(),
});

export const oauthTokenSchema = z.object({
  grantType: z.enum(["authorization_code", "refresh_token", "client_credentials"]),
  clientId: z.string().min(1),
  clientSecret: z.string().optional(),
  code: z.string().optional(),
  refreshToken: z.string().optional(),
  redirectUri: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DemoLoginInput = z.infer<typeof demoLoginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type Setup2FaInput = z.infer<typeof setup2FaSchema>;
export type SendPhoneCodeInput = z.infer<typeof sendPhoneCodeSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type EnrollBiometricInput = z.infer<typeof enrollBiometricSchema>;
export type VerifyBiometricInput = z.infer<typeof verifyBiometricSchema>;
export type MagicLinkRequestInput = z.infer<typeof magicLinkRequestSchema>;
export type MagicLinkVerifyInput = z.infer<typeof magicLinkVerifySchema>;
export type UnlockAccountInput = z.infer<typeof unlockAccountSchema>;
export type SetupSecurityQuestionsInput = z.infer<typeof setupSecurityQuestionsSchema>;
export type VerifySecurityQuestionsInput = z.infer<typeof verifySecurityQuestionsSchema>;
export type CreateOAuthClientInput = z.infer<typeof createOAuthClientSchema>;
export type OAuthAuthorizeInput = z.infer<typeof oauthAuthorizeSchema>;
export type OAuthTokenInput = z.infer<typeof oauthTokenSchema>;
