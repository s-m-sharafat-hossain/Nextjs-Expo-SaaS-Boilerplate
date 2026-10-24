// apps/web/src/shared/realtime/socket-server.ts
import { Server as NetServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

export interface UserPresence {
  userId: string;
  name?: string;
  avatar?: string;
  status: "ONLINE" | "AWAY" | "OFFLINE";
  lastSeen: string;
  activeRoom?: string;
  cursorPosition?: { x: number; y: number; line?: number; ch?: number };
}

export class RealtimeServer {
  private static io: SocketIOServer | null = null;
  private static userPresences = new Map<string, UserPresence>();

  /**
   * Initialize or retrieve the Socket.IO instance attached to an HTTP server
   */
  static init(server: NetServer): SocketIOServer {
    if (this.io) return this.io;

    this.io = new SocketIOServer(server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupListeners();
    return this.io;
  }

  static getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Setup core real-time communication channels and presence tracking
   */
  private static setupListeners() {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      const userId = (socket.handshake.query.userId as string) || socket.id;
      const userName = (socket.handshake.query.userName as string) || "Anonymous";

      // 1. Update presence to ONLINE
      const presence: UserPresence = {
        userId,
        name: userName,
        status: "ONLINE",
        lastSeen: new Date().toISOString(),
      };
      this.userPresences.set(userId, presence);

      // Join user's personal channel
      socket.join(`user:${userId}`);

      // Broadcast presence change to platform
      socket.broadcast.emit("presence:update", presence);

      // 2. Room Joining (Workspaces, Consultations, Chats)
      socket.on("room:join", ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        presence.activeRoom = roomId;
        this.io?.to(roomId).emit("room:user_joined", {
          userId,
          name: userName,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on("room:leave", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        this.io?.to(roomId).emit("room:user_left", {
          userId,
          timestamp: new Date().toISOString(),
        });
      });

      // 3. Live Chat & Typing Indicators
      socket.on("chat:message", (data: { sessionId: string; message: any }) => {
        socket.to(`chat:${data.sessionId}`).emit("chat:message_received", data.message);
      });

      socket.on("chat:typing", (data: { sessionId: string; isTyping: boolean }) => {
        socket.to(`chat:${data.sessionId}`).emit("chat:user_typing", {
          userId,
          userName,
          isTyping: data.isTyping,
        });
      });

      socket.on("chat:read_receipt", (data: { sessionId: string; messageId: string }) => {
        socket.to(`chat:${data.sessionId}`).emit("chat:message_read", {
          userId,
          messageId: data.messageId,
          readAt: new Date().toISOString(),
        });
      });

      // 4. Real-time Collaboration (Cursors & Document Sync)
      socket.on("collab:cursor_move", (data: { roomId: string; cursor: { x: number; y: number } }) => {
        presence.cursorPosition = data.cursor;
        socket.to(data.roomId).emit("collab:remote_cursor", {
          userId,
          userName,
          cursor: data.cursor,
        });
      });

      socket.on("collab:doc_change", (data: { roomId: string; delta: any }) => {
        socket.to(data.roomId).emit("collab:remote_change", {
          userId,
          delta: data.delta,
        });
      });

      // 5. Disconnect handling
      socket.on("disconnect", () => {
        presence.status = "OFFLINE";
        presence.lastSeen = new Date().toISOString();
        this.userPresences.set(userId, presence);
        socket.broadcast.emit("presence:update", presence);
      });
    });
  }

  // ─── Broadcaster Methods ──────────────────────────────────────────────────

  /**
   * Push real-time notification to a specific user
   */
  static sendNotification(userId: string, notification: any) {
    this.io?.to(`user:${userId}`).emit("notification:new", notification);
  }

  /**
   * Broadcast platform-wide live activity event
   */
  static broadcastActivity(activity: any) {
    this.io?.emit("activity:feed_update", activity);
  }

  /**
   * Broadcast metric updates for real-time dashboards
   */
  static broadcastMetricUpdate(metrics: Record<string, any>) {
    this.io?.emit("dashboard:metrics_update", metrics);
  }

  /**
   * Retrieve current active presences
   */
  static getAllPresences(): UserPresence[] {
    return Array.from(this.userPresences.values());
  }

  static getPresence(userId: string): UserPresence | null {
    return this.userPresences.get(userId) || null;
  }
}
