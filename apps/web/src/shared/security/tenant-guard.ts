// apps/web/src/shared/security/tenant-guard.ts
import { AppError } from "@/shared/utils/error-handler";
import { Role } from "@prisma/client";

/**
 * Asserts that the authenticated user matches the owner of the resource (IDOR prevention)
 */
export function assertResourceOwnership(
  resourceOwnerId: string,
  sessionUserId: string,
  userRole?: Role | string
) {
  // Super admins bypass resource ownership checks
  if (userRole === "ADMIN") return true;

  if (resourceOwnerId !== sessionUserId) {
    throw new AppError("Access denied: You do not own this resource", 403);
  }
  return true;
}

/**
 * Asserts that the user possesses one of the required platform roles
 */
export function assertRole(userRole: Role | string | undefined, allowedRoles: (Role | string)[]) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new AppError(
      `Access denied: Action requires role [${allowedRoles.join(", ")}], but current role is '${userRole || "ANONYMOUS"}'`,
      403
    );
  }
  return true;
}
