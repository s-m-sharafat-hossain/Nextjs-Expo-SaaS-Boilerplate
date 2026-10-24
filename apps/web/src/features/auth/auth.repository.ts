// apps/web/src/features/auth/auth.repository.ts
import { prisma } from "@/shared/lib/db";
import { Role } from "@prisma/client";
import { RegisterInput, UpdateProfileInput } from "./auth.schema";

export class AuthRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        wallet: true,
        subscription: true,
        sessions: {
          orderBy: { expires: "desc" },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        subscription: true,
        sessions: {
          orderBy: { expires: "desc" },
        },
        workspaceMembers: {
          include: { workspace: true },
        },
      },
    });
  }

  static async createUser(data: RegisterInput, passwordHash: string) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as Role,
        referredBy: data.referredBy,
        credits: 25,
        passwordHistory: [passwordHash],
      },
    });
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async update2Fa(userId: string, enabled: boolean, secret?: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: enabled,
        twoFactorSecret: secret,
      },
    });
  }

  static async findDemoUserByRole(role: Role) {
    return prisma.user.findFirst({
      where: { role, isActive: true },
      include: { wallet: true },
    });
  }

  // ─── Account Lockout & Security ───────────────────────────────────────────

  static async incrementFailedLogins(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: { increment: 1 },
      },
    });
  }

  static async lockAccount(userId: string, lockoutMinutes = 30) {
    const lockoutUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
    return prisma.user.update({
      where: { id: userId },
      data: {
        lockoutUntil,
      },
    });
  }

  static async resetFailedLogins(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });
  }

  static async updatePassword(userId: string, newPasswordHash: string, history: string[]) {
    // Keep last 5 passwords in history
    const updatedHistory = [newPasswordHash, ...history.slice(0, 4)];
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        passwordHistory: updatedHistory,
      },
    });
  }

  // ─── Phone & Biometric Verification ───────────────────────────────────────

  static async setPhoneVerified(userId: string, phone: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        phoneVerified: true,
      },
    });
  }

  static async setBiometricCredential(userId: string, credential: any) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        biometricCredential: credential,
      },
    });
  }

  static async setSecurityQuestions(userId: string, encryptedQuestions: any) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        securityQuestions: encryptedQuestions,
      },
    });
  }

  // ─── Session Management ───────────────────────────────────────────────────

  static async enforceConcurrentSessions(userId: string, maxSessions = 5) {
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { expires: "desc" },
    });

    if (sessions.length >= maxSessions) {
      // Remove excess older sessions
      const sessionsToDelete = sessions.slice(maxSessions - 1);
      const idsToDelete = sessionsToDelete.map((s) => s.id);
      await prisma.session.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }
  }

  static async revokeSession(sessionToken: string) {
    return prisma.session.deleteMany({
      where: { sessionToken },
    });
  }

  static async revokeAllUserSessions(userId: string) {
    return prisma.session.deleteMany({
      where: { userId },
    });
  }

  // ─── OAuth 2.0 Persistence ────────────────────────────────────────────────

  static async createOAuthClient(userId: string, name: string, redirectUris: string[], scopes: string[]) {
    const crypto = await import("crypto");
    const clientId = `client_${crypto.randomBytes(12).toString("hex")}`;
    const clientSecret = `secret_${crypto.randomBytes(24).toString("hex")}`;

    return prisma.oAuthClient.create({
      data: {
        userId,
        name,
        clientId,
        clientSecret,
        redirectUris,
        scopes,
      },
    });
  }

  static async findOAuthClient(clientId: string) {
    return prisma.oAuthClient.findUnique({
      where: { clientId },
    });
  }

  static async createOAuthToken(params: {
    clientId: string;
    userId: string;
    accessToken: string;
    refreshToken?: string;
    accessExpiresAt: Date;
    refreshExpiresAt?: Date;
    scopes: string[];
  }) {
    return prisma.oAuthToken.create({
      data: {
        clientId: params.clientId,
        userId: params.userId,
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        accessTokenExpiresAt: params.accessExpiresAt,
        refreshTokenExpiresAt: params.refreshExpiresAt,
        scopes: params.scopes,
      },
    });
  }

  static async findOAuthToken(accessToken: string) {
    return prisma.oAuthToken.findUnique({
      where: { accessToken },
      include: { user: true, client: true },
    });
  }

  static async revokeOAuthToken(token: string) {
    return prisma.oAuthToken.updateMany({
      where: { OR: [{ accessToken: token }, { refreshToken: token }] },
      data: { revoked: true },
    });
  }
}
