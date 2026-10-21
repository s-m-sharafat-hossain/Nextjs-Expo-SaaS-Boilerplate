// apps/web/src/features/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { generateSecret, generateURI, verifySync } from "otplib";
import { AuthRepository } from "./auth.repository";
import { LoginInput, RegisterInput, UpdateProfileInput } from "./auth.schema";
import { Role } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { siteConfig } from "@shared/config";

export class AuthService {
  /**
   * User login with password verification and optional 2FA OTP
   */
  static async login(input: LoginInput) {
    const user = await AuthRepository.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Your account has been deactivated. Please contact support.", 403);
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify 2FA if enabled
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

    return {
      requires2Fa: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        credits: user.credits,
      },
    };
  }

  /**
   * User registration with welcome credits
   */
  static async register(input: RegisterInput) {
    const existing = await AuthRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("An account with this email address already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await AuthRepository.createUser(input, passwordHash);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      credits: user.credits,
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
