// apps/web/src/app/api/v1/webhooks/endpoints/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { WebhookRepository } from "@/features/integrations/webhook.repository";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createEndpointSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  workspaceId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || undefined;

  try {
    const endpoints = await WebhookRepository.findEndpoints(workspaceId);
    return ApiResponse.success(endpoints, "Webhook endpoints retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  try {
    const body = await req.json();
    const parsed = createEndpointSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
    }

    const endpoint = await WebhookRepository.createEndpoint(parsed.data);
    return ApiResponse.success(endpoint, "Webhook endpoint created", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return ApiResponse.error("Missing endpoint ID", 400);

  try {
    await WebhookRepository.deleteEndpoint(id);
    return ApiResponse.success(null, "Webhook endpoint deleted");
  } catch (err: any) {
    return ApiResponse.error(err.message, 500);
  }
}
