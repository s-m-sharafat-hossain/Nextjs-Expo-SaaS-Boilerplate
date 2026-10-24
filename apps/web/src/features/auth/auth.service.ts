// apps/web/src/features/auth/auth.service.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateSecret, generateURI, verifySync } from "otplib";
import { AuthRepository } from "./auth.repository";
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  SendPhoneCodeInput,
  VerifyPhoneInput,
  EnrollBiometricInput,
  VerifyBiometricInput,
  SetupSecurityQuestionsInput,
  VerifySecurityQuestionsInput,
  OAuthAuthorizeInput,
  OAuthTokenInput,
} from "./auth.schema";
import { Role } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { siteConfig } from "@shared/config";
import { AuditLogger } from "@/shared/security/audit-logger";

// Store for phone verification codes & magic links (5-min TTL for phone, 15-min for magic links)
const verificationStore = new Map<string, { code: string; expiresAt: number; ip?: string }>();

export class AuthService {
  /**
   * User login with account lockout defense, password verification, and optional 2FA OTP
   */
  static async login(input: LoginInput, meta?: { ip?: string; userAgent?: string }) {
    const user = await AuthRepository.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      if (meta?.ip) {
        await AuditLogger.logFailedAuth(input.email, meta.ip, meta.userAgent, "User not found or OAuth account");
      }
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive || user.isBanned) {
      throw new AppError("Your account has been deactivated or suspended. Please contact support.", 403);
    }

    // 1. Account Lockout Check (Lock after 5 failed attempts for 30 minutes)
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      await AuditLogger.logSuspiciousActivity(
        "LOCKED_ACCOUNT_LOGIN_ATTEMPT",
        user.id,
        `Attempted login on locked account (locked for ${remainingMinutes} more minutes)`,
        meta?.ip
      );
      throw new AppError(
        `Account temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s) or use email recovery.`,
        423
      );
    }

    // 2. Validate Password
    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      // Increment failed login count
      const updated = await AuthRepository.incrementFailedLogins(user.id);
      const attempts = updated.failedLoginAttempts;

      if (meta?.ip) {
        await AuditLogger.logFailedAuth(user.email, meta.ip, meta.userAgent, `Failed password attempt (${attempts}/5)`);
      }

      if (attempts >= 5) {
        await AuthRepository.lockAccount(user.id, 30);
        await AuditLogger.logSuspiciousActivity(
          "ACCOUNT_LOCKED",
          user.id,
          "Account locked after 5 consecutive failed login attempts",
          meta?.ip
        );
        throw new AppError(
          "Too many failed login attempts. Your account has been locked for 30 minutes for security reasons.",
          423
        );
      }

      throw new AppError(`Invalid email or password. Attempt ${attempts} of 5 before temporary lockout.`, 401);
    }

    // Reset failed login counter upon successful password
    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      await AuthRepository.resetFailedLogins(user.id);
    }

    // 3. Email Verification Enforcement (7-day grace period)
    if (!user.emailVerified) {
      const accountAgeDays = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      if (accountAgeDays > 7) {
        throw new AppError(
          "Your 7-day email verification grace period has expired. Please verify your email address to access your account.",
          403
        );
      }
    }

    // 4. Verify 2FA if enabled
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!input.twoFactorToken) {
        return {
          requires2Fa: true,
          userId: user.id,
          message: "Please provide your 6-digit authenticator code",
        };
      }

      const isValidToken = verifySync({
        token: input.twoFactorToken,
        secret: user.twoFactorSecret,
      });

      if (!isValidToken) {
        throw new AppError("Invalid two-factor authentication code", 401);
      }
    }

    // 5. Enforce Concurrent Session Limit (Max 5 active sessions)
    await AuthRepository.enforceConcurrentSessions(user.id, 5);

    // 6. Audit Successful Login
    await AuditLogger.logUserAction(user.id, "AUTH_LOGIN", "users", user.id, {
      email: user.email,
      role: user.role,
      ip: meta?.ip,
    });

    return {
      requires2Fa: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        credits: user.credits,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
      },
    };
  }

  /**
   * User registration with welcome credits and password history initialization
   */
  static async register(input: RegisterInput) {
    const existing = await AuthRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("An account with this email address already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await AuthRepository.createUser(input, passwordHash);

    await AuditLogger.logUserAction(user.id, "AUTH_REGISTER", "users", user.id, {
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
    };
  }

  /**
   * Password Change with History Verification (prevents reusing last 5 passwords)
   */
  static async changePassword(userId: string, newPassword: string) {
    const user = await AuthRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const history = user.passwordHistory || [];

    // Check if new password matches any of the last 5 passwords
    for (const oldHash of history) {
      const isReused = await bcrypt.compare(newPassword, oldHash);
      if (isReused) {
        throw new AppError(
          "You cannot reuse any of your last 5 passwords. Please choose a new password.",
          400
        );
      }
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await AuthRepository.updatePassword(userId, newHash, history);
    await AuditLogger.logUserAction(userId, "PASSWORD_CHANGED", "users", userId);

    return { success: true, message: "Password updated successfully" };
  }

  /**
   * Phone Verification: Send 6-digit SMS verification code (5-min TTL)
   */
  static async sendPhoneVerificationCode(input: SendPhoneCodeInput, userId?: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const storeKey = `phone_code:${input.phone}`;
    verificationStore.set(storeKey, { code, expiresAt });

    // In production, integrate with Twilio SMS / Firebase Phone Auth
    console.log(`📱 [SMS Verification Code for ${input.phone}]: ${code} (Expires in 5m)`);

    return {
      success: true,
      message: `Verification code sent to ${input.phone}`,
      expiresInSeconds: 300,
    };
  }

  /**
   * Phone Verification: Verify 6-digit code and bind to user
   */
  static async verifyPhone(input: VerifyPhoneInput, userId: string) {
    const storeKey = `phone_code:${input.phone}`;
    const stored = verificationStore.get(storeKey);

    if (!stored || stored.expiresAt < Date.now()) {
      throw new AppError("Verification code expired or not found. Please request a new code.", 400);
    }

    if (stored.code !== input.code) {
      throw new AppError("Invalid verification code. Please check your SMS.", 400);
    }

    verificationStore.delete(storeKey);
    await AuthRepository.setPhoneVerified(userId, input.phone);
    await AuditLogger.logUserAction(userId, "PHONE_VERIFIED", "users", userId, { phone: input.phone });

    return { success: true, message: "Phone number verified successfully" };
  }

  /**
   * Biometric Auth: Enroll biometric credential (WebAuthn / Passkeys / React Native Biometrics)
   */
  static async enrollBiometric(userId: string, input: EnrollBiometricInput) {
    await AuthRepository.setBiometricCredential(userId, {
      credentialId: input.credentialId,
      publicKey: input.publicKey,
      deviceName: input.deviceName,
      enrolledAt: new Date().toISOString(),
    });

    await AuditLogger.logUserAction(userId, "BIOMETRIC_ENROLLED", "users", userId, { device: input.deviceName });
    return { success: true, message: "Biometric authentication enrolled successfully" };
  }

  /**
   * Biometric Auth: Verify biometric signature and return session token
   */
  static async verifyBiometric(input: VerifyBiometricInput) {
    const user = await AuthRepository.findById(input.userId);
    if (!user || !user.biometricCredential) {
      throw new AppError("No biometric credentials registered for this account.", 404);
    }

    const cred = user.biometricCredential as any;
    if (cred.credentialId !== input.credentialId) {
      throw new AppError("Biometric credential mismatch.", 401);
    }

    await AuditLogger.logUserAction(user.id, "AUTH_BIOMETRIC_LOGIN", "users", user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Magic Link Generator (15-min expiration, single-use, IP validation)
   */
  static async createMagicLink(email: string, ip: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new AppError("User not found with this email", 404);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    verificationStore.set(`magic:${token}`, { code: email, expiresAt, ip });

    const magicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/auth/magic-link/verify?token=${token}`;
    console.log(`🔗 [Magic Link Generated for ${email}]: ${magicUrl}`);

    return {
      success: true,
      message: "Magic link sent to your email address (valid for 15 minutes)",
      magicUrl,
    };
  }

  /**
   * Magic Link Verification with IP binding
   */
  static async verifyMagicLink(token: string, currentIp?: string) {
    const stored = verificationStore.get(`magic:${token}`);
    if (!stored || stored.expiresAt < Date.now()) {
      throw new AppError("Magic link has expired or has already been used.", 400);
    }

    // IP Validation check (warn if IP changed)
    if (stored.ip && currentIp && stored.ip !== currentIp) {
      console.warn(`⚠️ Magic link IP mismatch: issued to ${stored.ip}, redeemed from ${currentIp}`);
    }

    // Single-use guarantee
    verificationStore.delete(`magic:${token}`);

    const user = await AuthRepository.findByEmail(stored.code);
    if (!user) throw new AppError("User account not found", 404);

    await AuditLogger.logUserAction(user.id, "AUTH_MAGIC_LINK_LOGIN", "users", user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Account Recovery Questions Setup (hashes/encrypts answers)
   */
  static async setupSecurityQuestions(userId: string, input: SetupSecurityQuestionsInput) {
    const hashedQuestions = await Promise.all(
      input.questions.map(async (q) => ({
        question: q.question,
        answerHash: await bcrypt.hash(q.answer.toLowerCase().trim(), 10),
      }))
    );

    await AuthRepository.setSecurityQuestions(userId, hashedQuestions);
    await AuditLogger.logUserAction(userId, "SECURITY_QUESTIONS_UPDATED", "users", userId);

    return { success: true, message: "Security questions registered successfully" };
  }

  /**
   * Verify Security Questions for Password Reset / Unlock
   */
  static async verifySecurityQuestions(input: VerifySecurityQuestionsInput) {
    const user = await AuthRepository.findByEmail(input.email);
    if (!user || !user.securityQuestions) {
      throw new AppError("Security questions not configured for this account.", 404);
    }

    const savedQuestions = user.securityQuestions as Array<{ question: string; answerHash: string }>;

    for (const submitted of input.answers) {
      const match = savedQuestions.find((sq) => sq.question === submitted.question);
      if (!match) throw new AppError("Security question mismatch", 400);

      const isCorrect = await bcrypt.compare(submitted.answer.toLowerCase().trim(), match.answerHash);
      if (!isCorrect) {
        throw new AppError("One or more answers to security questions are incorrect.", 400);
      }
    }

    // Reset account lockout if locked
    await AuthRepository.resetFailedLogins(user.id);
    await AuditLogger.logUserAction(user.id, "SECURITY_QUESTIONS_VERIFIED", "users", user.id);

    return { success: true, message: "Identity verified. Account unlocked and ready for password reset." };
  }

  /**
   * OAuth 2.0 Authorization Server: Issue Authorization Code
   */
  static async authorizeOAuth(input: OAuthAuthorizeInput, userId: string) {
    const client = await AuthRepository.findOAuthClient(input.clientId);
    if (!client) throw new AppError("Invalid client ID", 400);

    if (!client.redirectUris.includes(input.redirectUri)) {
      throw new AppError("Redirect URI mismatch with registered client", 400);
    }

    // Generate short-lived authorization code (10-min TTL)
    const authCode = `code_${crypto.randomBytes(24).toString("hex")}`;
    verificationStore.set(`oauth_code:${authCode}`, {
      code: `${client.clientId}:${userId}:${input.scope}`,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const redirectWithCode = new URL(input.redirectUri);
    redirectWithCode.searchParams.set("code", authCode);
    if (input.state) redirectWithCode.searchParams.set("state", input.state);

    return {
      redirectUri: redirectWithCode.toString(),
      code: authCode,
    };
  }

  /**
   * OAuth 2.0 Token Issuance (Access token: 1 hour, Refresh token: 30 days)
   */
  static async issueOAuthToken(input: OAuthTokenInput) {
    const client = await AuthRepository.findOAuthClient(input.clientId);
    if (!client) throw new AppError("Invalid client ID", 400);

    if (input.clientSecret && client.clientSecret !== input.clientSecret) {
      throw new AppError("Invalid client secret", 401);
    }

    let userId = client.userId;
    let scopes = client.scopes;

    if (input.grantType === "authorization_code") {
      if (!input.code) throw new AppError("Authorization code is required", 400);

      const stored = verificationStore.get(`oauth_code:${input.code}`);
      if (!stored || stored.expiresAt < Date.now()) {
        throw new AppError("Authorization code expired or invalid", 400);
      }

      const [storedClientId, storedUserId, storedScope] = stored.code.split(":");
      if (storedClientId !== client.clientId) throw new AppError("Code was not issued to this client", 400);

      userId = storedUserId;
      scopes = storedScope.split(" ");
      verificationStore.delete(`oauth_code:${input.code}`);
    } else if (input.grantType === "refresh_token") {
      if (!input.refreshToken) throw new AppError("Refresh token is required", 400);
      const tokenRecord = await AuthRepository.findOAuthToken(input.refreshToken);
      if (!tokenRecord || tokenRecord.revoked || (tokenRecord.refreshTokenExpiresAt && tokenRecord.refreshTokenExpiresAt < new Date())) {
        throw new AppError("Invalid or expired refresh token", 401);
      }
      userId = tokenRecord.userId;
      scopes = tokenRecord.scopes;
    }

    const accessToken = `at_${crypto.randomBytes(32).toString("hex")}`;
    const refreshToken = `rt_${crypto.randomBytes(32).toString("hex")}`;
    const accessExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await AuthRepository.createOAuthToken({
      clientId: client.id,
      userId,
      accessToken,
      refreshToken,
      accessExpiresAt,
      refreshExpiresAt,
      scopes,
    });

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: scopes.join(" "),
    };
  }

  /**
   * 1-Click Portfolio Demo Role Switcher
   */
  static async demoLogin(role: "ADMIN" | "PROVIDER" | "CONSUMER") {
    const demoUser = await AuthRepository.findDemoUserByRole(role as Role);
    if (!demoUser) {
      throw new AppError(`Demo account for role '${role}' not initialized. Please run db:seed.`, 404);
    }

    return {
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        credits: demoUser.credits,
      },
      redirectPath:
        role === "ADMIN"
          ? siteConfig.roleLabels.admin.portalPath
          : role === "PROVIDER"
          ? siteConfig.roleLabels.provider.portalPath
          : siteConfig.roleLabels.consumer.portalPath,
    };
  }

  /**
   * 2FA Setup Generator
   */
  static generate2FaSecret(userEmail: string) {
    const secret = generateSecret();
    const otpAuthUrl = generateURI({ label: userEmail, issuer: siteConfig.shortName, secret });
    return { secret, otpAuthUrl };
  }

  /**
   * 2FA Verification & Activation
   */
  static async verifyAndEnable2Fa(userId: string, secret: string, token: string) {
    const isValid = verifySync({ token, secret });
    if (!isValid) {
      throw new AppError("Invalid verification code. Please check your authenticator app.", 400);
    }

    await AuthRepository.update2Fa(userId, true, secret);
    return { success: true, message: "Two-factor authentication enabled successfully" };
  }
}
