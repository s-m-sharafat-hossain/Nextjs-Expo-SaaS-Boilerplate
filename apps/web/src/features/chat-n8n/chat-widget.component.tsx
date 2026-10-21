// apps/web/src/features/chat-n8n/chat-widget.component.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Minus } from "lucide-react";
import { sendMessageAction } from "./chat.action";

export function ChatWidgetComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([
    {
      id: "w-1",
      role: "assistant",
      content:
        "Hi there! 👋 How can I assist you today? Ask about bookings, plans, or clinical triage.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: "u-" + Date.now(), role: "user", content: userText }]);
    setIsSending(true);

    try {
      const res = await sendMessageAction({ message: userText, sessionId });
      if (res.success && res.data) {
        if (!sessionId) setSessionId(res.data.sessionId);
        setMessages((prev) => [
          ...prev,
          { id: res.data.message.id, role: "assistant", content: res.data.message.content },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "err-" + Date.now(),
            role: "assistant",
            content: res.error || "Sorry, I couldn't process that right now.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: "err-" + Date.now(), role: "assistant", content: "Connection error. Please retry." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
          aria-label="Open AI Assistant"
        >
          <Bot size={20} className="animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      )}

      {/* Floating Popover Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={17} />
              </div>
              <div>
                <h3 className="text-xs font-bold">Health & Support AI</h3>
                <p className="text-[10px] text-white/80">Online • 24/7 Virtual Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-900/30">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isUser ? "bg-slate-700 text-white" : "bg-blue-600 text-white"
                    }`}
                  >
                    {isUser ? "U" : "AI"}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xs"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  AI
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 rounded-tl-none shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
