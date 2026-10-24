// apps/web/src/features/integrations/webhook.repository.ts
import { prisma } from "@/shared/lib/prisma";
import crypto from "crypto";

export interface CreateEndpointDTO {
  workspaceId?: string;
  url: string;
  events: string[];
  secret?: string;
}

export class WebhookRepository {
  static async findEndpoints(workspaceId?: string) {
    return prisma.webhookEndpoint.findMany({
      where: workspaceId ? { workspaceId } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  static async createEndpoint(data: CreateEndpointDTO) {
    const secret = data.secret || `whsec_${crypto.randomBytes(24).toString("hex")}`;
    return prisma.webhookEndpoint.create({
      data: {
        workspaceId: data.workspaceId,
        url: data.url,
        events: data.events,
        secret,
        isActive: true,
      },
    });
  }

  static async deleteEndpoint(id: string) {
    return prisma.webhookEndpoint.delete({ where: { id } });
  }

  static async toggleActive(id: string, isActive: boolean) {
    return prisma.webhookEndpoint.update({
      where: { id },
      data: { isActive },
    });
  }
}
