// apps/web/src/app/api/v1/sms/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { twilioService } from "@/shared/sms/twilio";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const sendSmsSchema = z.object({
  to: z.string().min(10),
  body: z.string().min(1).max(1600),
  type: z.enum(["sms", "whatsapp"]).default("sms"),
});

const otpSendSchema = z.object({
  to: z.string().min(10),
  channel: z.enum(["sms", "whatsapp", "email", "call"]).default("sms"),
});

const otpVerifySchema = z.object({
  to: z.string().min(10),
  code: z.string().length(6),
});

/**
 * POST /api/v1/sms
 * body: { action: "send" | "otp-send" | "otp-verify", ...payload }
 */
export async function POST(req: NextRequest) {
  const session = await auth();

  try {
    const body = await req.json();
    const { action, ...payload } = body;

    if (action === "send") {
      // Admin-only direct SMS sending
      if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return ApiResponse.error("Forbidden", 403);
      }
      const parsed = sendSmsSchema.parse(payload);
      const result = parsed.type === "whatsapp"
        ? await twilioService.sendWhatsApp(parsed.to, parsed.body)
        : await twilioService.sendSms({ to: parsed.to, body: parsed.body });

      if (!result.success) return ApiResponse.error(result.error || "SMS failed", 500);
      return ApiResponse.success({ sid: result.sid }, "Message sent");
    }

    if (action === "otp-send") {
      const parsed = otpSendSchema.parse(payload);
      const result = await twilioService.sendOtp(parsed);
      if (!result.success) return ApiResponse.error(result.error || "OTP send failed", 500);
      return ApiResponse.success({ status: result.status }, "OTP sent");
    }

    if (action === "otp-verify") {
      const parsed = otpVerifySchema.parse(payload);
      const result = await twilioService.verifyOtp(parsed);
      if (!result.success) return ApiResponse.error(result.error || "Invalid OTP", 400);
      return ApiResponse.success({ status: result.status }, "OTP verified");
    }

    return ApiResponse.error(`Unknown action: ${action}`, 400);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return ApiResponse.error("Validation failed", 400, err.errors);
    }
    return ApiResponse.error("Request failed", 500);
  }
}
