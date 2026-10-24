// apps/web/src/app/api/v1/auth/magic-link/verify/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const GET = AuthController.verifyMagicLink;
export const POST = AuthController.verifyMagicLink;
