// apps/web/src/app/api/v1/auth/recovery-questions/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const POST = AuthController.setupSecurityQuestions;
export const PUT = AuthController.verifySecurityQuestions;
