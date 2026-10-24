// apps/web/src/app/api/v1/oauth/authorize/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const GET = AuthController.oauthAuthorize;
export const POST = AuthController.oauthAuthorize;
