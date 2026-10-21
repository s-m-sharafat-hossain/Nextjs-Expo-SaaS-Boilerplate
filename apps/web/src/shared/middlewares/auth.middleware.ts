// src/shared/middlewares/auth.middleware.ts
import { NextRequest } from "next/server";
import { AppError } from "@/shared/utils/error-handler";
import { Role } from "@prisma/client";
import { db } from "@/shared/lib/db";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export class AuthMiddleware {
  /**
   * Helper to verify user from Request header/query or demo context
   */
  static async authenticate(req: NextRequest): Promise<AuthenticatedUser> {
    const userId =
      req.headers.get("x-user-id") ||
      new URL(req.url).searchParams.get("userId");

    if (!userId) {
      throw new AppError("Unauthorized: Missing user authentication credentials", 401);
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new AppError("Unauthorized: User not found", 401);
    }

    return user;
  }

  /**
   * Role-based guard helper
   */
  static requireRole(user: AuthenticatedUser, allowedRoles: Role[]) {
    if (!allowedRoles.includes(user.role)) {
      throw new AppError(
        `Forbidden: Role '${user.role}' does not have permission to access this resource`,
        403
      );
    }
  }
}
