// apps/web/src/app/api/v1/auth/phone/send-code/route.ts
import { AuthController } from "@/features/auth/auth.controller";

export const POST = AuthController.sendPhoneCode;
