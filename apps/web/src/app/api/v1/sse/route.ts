// apps/web/src/app/api/v1/sse/route.ts
import { NextRequest } from "next/server";
import { SseBroadcaster } from "@/shared/realtime/sse";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || req.headers.get("x-user-id") || "anonymous";

  let streamController: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      streamController = controller;
      SseBroadcaster.register(userId, controller);

      // Send initial connection handshake event
      const handshake = `event: connected\ndata: ${JSON.stringify({ userId, connectedAt: new Date().toISOString() })}\n\n`;
      controller.enqueue(new TextEncoder().encode(handshake));
    },
    cancel() {
      if (streamController) {
        SseBroadcaster.unregister(userId, streamController);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
