// apps/web/src/app/api/v1/auth/2fa/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const GET = AuthController.setup2Fa;
export const POST = AuthController.verify2Fa;
