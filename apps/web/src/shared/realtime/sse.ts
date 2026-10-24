// apps/web/src/shared/realtime/sse.ts
type SSEController = ReadableStreamDefaultController;

export class SseBroadcaster {
  private static clients = new Map<string, Set<SSEController>>();

  /**
   * Register an active SSE stream connection for a client
   */
  static register(userId: string, controller: SSEController) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(controller);
  }

  /**
   * Remove disconnected controller
   */
  static unregister(userId: string, controller: SSEController) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(controller);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Send SSE message to a specific user
   */
  static sendToUser(userId: string, eventName: string, data: any) {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);

    for (const controller of userClients) {
      try {
        controller.enqueue(encoded);
      } catch {
        userClients.delete(controller);
      }
    }
  }

  /**
   * Broadcast an event to all connected SSE clients
   */
  static broadcast(eventName: string, data: any) {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);

    for (const [, userClients] of this.clients.entries()) {
      for (const controller of userClients) {
        try {
          controller.enqueue(encoded);
        } catch {
          userClients.delete(controller);
        }
      }
    }
  }
}
