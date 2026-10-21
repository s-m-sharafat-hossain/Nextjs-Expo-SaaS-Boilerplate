// apps/web/src/features/auth/auth.controller.ts
import { NextRequest } from "next/server";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema, demoLoginSchema, setup2FaSchema } from "./auth.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class AuthController {
  static login = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = loginSchema.parse(body);
    const result = await AuthService.login(validated);
    return ApiResponse.success(result, "Logged in successfully", 200);
  });

  static register = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = registerSchema.parse(body);
    const result = await AuthService.register(validated);
    return ApiResponse.success(result, "User registered successfully", 201);
  });

  static demoLogin = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = demoLoginSchema.parse(body);
    const result = await AuthService.demoLogin(validated.role);
    return ApiResponse.success(result, `Switched to ${validated.role} demo role successfully`);
  });

  static setup2Fa = asyncHandler(async (req: NextRequest) => {
    const userEmail = req.headers.get("x-user-email") || "user@demo.com";
    const result = AuthService.generate2FaSecret(userEmail);
    return ApiResponse.success(result, "2FA secret generated");
  });

  static verify2Fa = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("Authentication required", 401);
    }
    const body = await req.json();
    const { token, secret } = setup2FaSchema.parse(body);
    const result = await AuthService.verifyAndEnable2Fa(userId, secret, token);
    return ApiResponse.success(result, "2FA enabled successfully");
  });
}
