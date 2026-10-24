// apps/web/src/app/api/v1/branding/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { BrandingService } from "@/features/branding/branding.service";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const brandingSchema = z.object({
  workspaceId: z.string(),
  companyName: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  customCss: z.string().max(5000).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return ApiResponse.error("workspaceId is required", 400);

  try {
    const branding = await BrandingService.getBranding(workspaceId);
    return ApiResponse.success(branding, "Workspace branding retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = brandingSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
    }

    const { workspaceId, ...branding } = parsed.data;
    const updated = await BrandingService.updateBranding(workspaceId, branding);
    return ApiResponse.success(updated, "Branding updated successfully");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}
