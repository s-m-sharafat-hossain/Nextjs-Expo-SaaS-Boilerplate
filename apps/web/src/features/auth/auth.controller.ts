// apps/web/src/features/auth/auth.controller.ts
import { NextRequest } from "next/server";
import { AuthService } from "./auth.service";
import {
  loginSchema,
  registerSchema,
  demoLoginSchema,
  setup2FaSchema,
  sendPhoneCodeSchema,
  verifyPhoneSchema,
  enrollBiometricSchema,
  verifyBiometricSchema,
  magicLinkRequestSchema,
  magicLinkVerifySchema,
  setupSecurityQuestionsSchema,
  verifySecurityQuestionsSchema,
  oauthAuthorizeSchema,
  oauthTokenSchema,
} from "./auth.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";
import { InputSanitizer } from "@/shared/security/sanitizer";
import { RateLimiter } from "@/shared/security/rate-limiter";

export class AuthController {
  static login = asyncHandler(async (req: NextRequest) => {
    const rawBody = await req.json();
    const sanitized = InputSanitizer.sanitizeBody(rawBody);
    const validated = loginSchema.parse(sanitized);

    const ip = RateLimiter.getClientIp(req);
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await AuthService.login(validated, { ip, userAgent });
    return ApiResponse.success(result, "Logged in successfully", 200);
  });

  static register = asyncHandler(async (req: NextRequest) => {
    const rawBody = await req.json();
    const sanitized = InputSanitizer.sanitizeBody(rawBody);
    const validated = registerSchema.parse(sanitized);
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

  // ─── Phone Verification Handlers ──────────────────────────────────────────

  static sendPhoneCode = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = sendPhoneCodeSchema.parse(body);
    const userId = req.headers.get("x-user-id") || undefined;
    const result = await AuthService.sendPhoneVerificationCode(validated, userId);
    return ApiResponse.success(result, result.message);
  });

  static verifyPhone = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("Authentication required for phone verification", 401);
    }
    const body = await req.json();
    const validated = verifyPhoneSchema.parse(body);
    const result = await AuthService.verifyPhone(validated, userId);
    return ApiResponse.success(result, result.message);
  });

  // ─── Biometric Handlers ───────────────────────────────────────────────────

  static enrollBiometric = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("Authentication required for biometric enrollment", 401);
    }
    const body = await req.json();
    const validated = enrollBiometricSchema.parse(body);
    const result = await AuthService.enrollBiometric(userId, validated);
    return ApiResponse.success(result, result.message);
  });

  static verifyBiometric = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = verifyBiometricSchema.parse(body);
    const result = await AuthService.verifyBiometric(validated);
    return ApiResponse.success(result, "Biometric authentication successful");
  });

  // ─── Magic Link Handlers ──────────────────────────────────────────────────

  static requestMagicLink = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = magicLinkRequestSchema.parse(body);
    const ip = RateLimiter.getClientIp(req);
    const result = await AuthService.createMagicLink(validated.email, ip);
    return ApiResponse.success(result, result.message);
  });

  static verifyMagicLink = asyncHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || (await req.json().catch(() => ({}))).token;
    const validated = magicLinkVerifySchema.parse({ token });
    const ip = RateLimiter.getClientIp(req);
    const result = await AuthService.verifyMagicLink(validated.token, ip);
    return ApiResponse.success(result, "Magic link authentication successful");
  });

  // ─── Security Questions Handlers ──────────────────────────────────────────

  static setupSecurityQuestions = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("Authentication required", 401);
    }
    const body = await req.json();
    const validated = setupSecurityQuestionsSchema.parse(body);
    const result = await AuthService.setupSecurityQuestions(userId, validated);
    return ApiResponse.success(result, result.message);
  });

  static verifySecurityQuestions = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = verifySecurityQuestionsSchema.parse(body);
    const result = await AuthService.verifySecurityQuestions(validated);
    return ApiResponse.success(result, result.message);
  });

  // ─── OAuth 2.0 Handlers ───────────────────────────────────────────────────

  static oauthAuthorize = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("User authentication required to grant authorization", 401);
    }
    const { searchParams } = new URL(req.url);
    const validated = oauthAuthorizeSchema.parse({
      clientId: searchParams.get("client_id") || "",
      redirectUri: searchParams.get("redirect_uri") || "",
      responseType: searchParams.get("response_type") || "code",
      scope: searchParams.get("scope") || "read",
      state: searchParams.get("state") || undefined,
    });
    const result = await AuthService.authorizeOAuth(validated, userId);
    return ApiResponse.success(result, "Authorization granted");
  });

  static oauthToken = asyncHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = oauthTokenSchema.parse({
      grantType: body.grant_type || body.grantType,
      clientId: body.client_id || body.clientId,
      clientSecret: body.client_secret || body.clientSecret,
      code: body.code,
      refreshToken: body.refresh_token || body.refreshToken,
      redirectUri: body.redirect_uri || body.redirectUri,
    });
    const result = await AuthService.issueOAuthToken(validated);
    return ApiResponse.success(result, "Token issued successfully");
  });
}
