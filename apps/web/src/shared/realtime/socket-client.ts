// apps/web/src/shared/realtime/socket-client.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { UserPresence } from "./socket-server";

export interface UseSocketOptions {
  userId?: string;
  userName?: string;
  autoConnect?: boolean;
}

export function useRealtimeSocket(options: UseSocketOptions = {}) {
  const { userId, userName, autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [presences, setPresences] = useState<Map<string, UserPresence>>(new Map());
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!autoConnect) return;

    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");

    const socket = io(socketUrl, {
      path: "/api/socketio",
      query: {
        userId: userId || "anonymous",
        userName: userName || "Visitor",
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Presence updates
    socket.on("presence:update", (presence: UserPresence) => {
      setPresences((prev) => {
        const next = new Map(prev);
        if (presence.status === "OFFLINE") {
          next.delete(presence.userId);
        } else {
          next.set(presence.userId, presence);
        }
        return next;
      });
    });

    // Real-time notifications
    socket.on("notification:new", (notification: any) => {
      setLastNotification(notification);
    });

    // Typing indicators
    socket.on("chat:user_typing", ({ userId: typingId, userName: typingName, isTyping }: any) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping) {
          next.set(typingId, typingName);
        } else {
          next.delete(typingId);
        }
        return next;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, userName, autoConnect]);

  const joinRoom = useCallback((roomId: string) => {
    socketRef.current?.emit("room:join", { roomId });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketRef.current?.emit("room:leave", { roomId });
  }, []);

  const sendChatMessage = useCallback((sessionId: string, message: any) => {
    socketRef.current?.emit("chat:message", { sessionId, message });
  }, []);

  const setTypingStatus = useCallback((sessionId: string, isTyping: boolean) => {
    socketRef.current?.emit("chat:typing", { sessionId, isTyping });
  }, []);

  const sendCursorPosition = useCallback((roomId: string, cursor: { x: number; y: number }) => {
    socketRef.current?.emit("collab:cursor_move", { roomId, cursor });
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    presences: Array.from(presences.values()),
    lastNotification,
    typingUsers: Array.from(typingUsers.values()),
    joinRoom,
    leaveRoom,
    sendChatMessage,
    setTypingStatus,
    sendCursorPosition,
  };
}
