// apps/web/src/app/api/v1/auth/magic-link/request/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const POST = AuthController.requestMagicLink;
