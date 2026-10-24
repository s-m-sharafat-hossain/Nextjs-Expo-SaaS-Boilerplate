// apps/web/src/shared/webhooks/webhook-dispatcher.ts
import crypto from "crypto";
import { prisma } from "@/shared/lib/prisma";

export interface WebhookEventPayload {
  id: string;
  event: string;
  timestamp: string;
  workspaceId?: string;
  data: Record<string, any>;
}

export interface DeliveryResult {
  endpointId: string;
  url: string;
  status: number;
  success: boolean;
  error?: string;
}

export class WebhookDispatcher {
  /**
   * Compute HMAC SHA-256 signature for payload verification
   */
  static signPayload(payloadString: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(payloadString).digest("hex");
  }

  /**
   * Broadcast an event to all matching registered webhook endpoints
   */
  static async dispatch(
    event: string,
    data: Record<string, any>,
    workspaceId?: string
  ): Promise<DeliveryResult[]> {
    const payload: WebhookEventPayload = {
      id: `evt_${crypto.randomUUID()}`,
      event,
      timestamp: new Date().toISOString(),
      workspaceId,
      data,
    };

    const payloadString = JSON.stringify(payload);

    // Find subscribed active endpoints
    const endpoints = await prisma.webhookEndpoint.findMany({
      where: {
        isActive: true,
        ...(workspaceId ? { OR: [{ workspaceId }, { workspaceId: null }] } : {}),
      },
    });

    const matching = endpoints.filter(
      (ep) => ep.events.length === 0 || ep.events.includes("*") || ep.events.includes(event)
    );

    const results: DeliveryResult[] = [];

    for (const ep of matching) {
      const signature = this.signPayload(payloadString, ep.secret);

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(ep.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "SaaSFlow-Webhook/1.0",
            "X-SaaSFlow-Signature": signature,
            "X-SaaSFlow-Event": event,
            "X-SaaSFlow-Delivery": payload.id,
            "X-SaaSFlow-Timestamp": payload.timestamp,
          },
          body: payloadString,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        results.push({
          endpointId: ep.id,
          url: ep.url,
          status: res.status,
          success: res.ok,
        });
      } catch (err: any) {
        results.push({
          endpointId: ep.id,
          url: ep.url,
          status: 0,
          success: false,
          error: err.message,
        });
      }
    }

    return results;
  }
}
