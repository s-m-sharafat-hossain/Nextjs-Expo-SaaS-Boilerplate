// apps/web/src/app/api/v1/domains/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { DomainService } from "@/shared/domains/domain-service";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const registerDomainSchema = z.object({
  domain: z.string().min(3),
  workspaceId: z.string(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return ApiResponse.error("workspaceId is required", 400);

  try {
    const domain = await prisma.customDomain.findUnique({
      where: { workspaceId },
    });
    return ApiResponse.success(domain, "Domain record retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = registerDomainSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
    }

    const domain = await DomainService.registerDomain(parsed.data.workspaceId, parsed.data.domain);
    return ApiResponse.success(domain, "Custom domain registered", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return ApiResponse.error("workspaceId is required", 400);

  try {
    await prisma.customDomain.delete({ where: { workspaceId } });
    return ApiResponse.success(null, "Domain detached successfully");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}
