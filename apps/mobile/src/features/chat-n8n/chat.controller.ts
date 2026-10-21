// apps/mobile/src/features/chat-n8n/chat.controller.ts
import { useState, useEffect, useCallback } from "react";
import { ChatService } from "./chat.service";
import { ChatMessage, SendMessageInputSchema } from "./chat.schema";
import { useAuthStore } from "@/shared/stores/auth.store";

export function useChatController(initialSessionId?: string) {
  const { user } = useAuthStore();
  const [sessionId, setSessionId] = useState<string>(initialSessionId || "demo-session-1");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /**
   * Load message history
   */
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const history = await ChatService.getHistory(sessionId);
      setMessages(history);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * Send message with optimistic update
   */
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isSending) return;

    // Validate schema
    const validation = SendMessageInputSchema.safeParse({
      message: prompt,
      sessionId,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI append
    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsSending(true);
    setError(null);

    try {
      const response = await ChatService.sendMessage({
        message: prompt,
        sessionId,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        createdAt: new Date().toISOString(),
        tokensUsed: response.tokensUsed,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Clear session
   */
  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Chat cleared. What else can I help you accomplish today?",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return {
    sessionId,
    messages,
    isLoading,
    isSending,
    inputPrompt,
    setInputPrompt,
    error,
    handleSendMessage,
    handleClearChat,
    reloadHistory: loadHistory,
    userCredits: user?.credits ?? 35,
  };
}
