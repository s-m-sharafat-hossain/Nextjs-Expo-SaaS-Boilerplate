// src/shared/utils/tenant-guard.ts
// Tenant Isolation & IDOR (Insecure Direct Object Reference) Prevention Helper
import { AppError } from "./error-handler";

export class TenantGuard {
  /**
   * Asserts that the authenticated user owns the given resource
   * Throws 403 Forbidden if user is not the owner and not an ADMIN
   */
  static assertOwnership(
    resourceUserId: string | null | undefined,
    currentUserId: string,
    currentUserRole?: string
  ) {
    if (!resourceUserId) {
      throw new AppError("Resource owner not defined", 400);
    }

    if (currentUserRole === "ADMIN") {
      return true; // Admins can bypass tenant ownership for support/moderation
    }

    if (resourceUserId !== currentUserId) {
      throw new AppError("Forbidden: You do not have permission to access or modify this resource", 403);
    }

    return true;
  }

  /**
   * Helper to append user ownership filter to any Prisma where query
   */
  static scopeByUser<T extends Record<string, unknown>>(whereClause: T, userId: string): T & { userId: string } {
    return {
      ...whereClause,
      userId,
    };
  }
}
