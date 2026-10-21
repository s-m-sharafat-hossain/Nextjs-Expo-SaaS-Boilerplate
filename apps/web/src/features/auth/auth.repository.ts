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
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        subscription: true,
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
}
