"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  userId?: string;
}

export function ChatWidget({ userId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I am your n8n AI Assistant. Ask me anything or trigger a workflow automation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          userId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (!sessionId && json.data.sessionId) {
          setSessionId(json.data.sessionId);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: json.data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: json.message || "Failed to receive response from AI agent.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Network error connecting to AI agent.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all duration-200 border border-indigo-400/30"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[520px] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-800/80 backdrop-blur border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">n8n AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">Online & Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/90 text-slate-400 p-3 rounded-2xl rounded-bl-none border border-slate-700/60 flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>AI Agent thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800/50 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI or run workflow..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
