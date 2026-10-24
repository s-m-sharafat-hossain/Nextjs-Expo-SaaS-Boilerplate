// apps/web/src/app/api/v1/domains/verify/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { DomainService } from "@/shared/domains/domain-service";
import { auth } from "@/shared/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  try {
    const body = await req.json();
    if (!body.domain) return ApiResponse.error("domain is required", 400);

    const result = await DomainService.verifyDomain(body.domain);
    return ApiResponse.success(result, "DNS verification complete");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}
