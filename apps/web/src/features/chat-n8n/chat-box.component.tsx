// apps/web/src/features/chat-n8n/chat-box.component.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Clock,
  Zap,
  HelpCircle,
  Stethoscope,
} from "lucide-react";
import { sendMessageAction } from "./chat.action";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

const PRESET_PROMPTS = [
  "How do I schedule an appointment with Dr. Sarah Mitchell?",
  "What are the fees for a second opinion consultation?",
  "I have a mild headache and low-grade fever. What should I do?",
  "How does the provider commission and escrow payout work?",
];

export function ChatBoxComponent({
  initialSessionId,
  initialMessages = [],
  userId,
  userRole = "CONSUMER",
}: {
  initialSessionId?: string;
  initialMessages?: Message[];
  userId?: string;
  userRole?: string;
}) {
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! I am your AI Health Triage & Scheduling Assistant. How can I assist you with doctor bookings, consultations, or platform questions today?",
          },
        ]
  );
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isSending) return;

    setInput("");
    const tempUserMsg: Message = {
      id: "temp-" + Date.now(),
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await sendMessageAction(
        {
          message: prompt,
          sessionId,
        },
        userId,
        userRole
      );

      if (res.success && res.data) {
        if (!sessionId) {
          setSessionId(res.data.sessionId);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: res.data.message.id,
            role: "assistant",
            content: res.data.message.content,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "error-" + Date.now(),
            role: "assistant",
            content: res.error || "Sorry, I encountered an issue. Please try again.",
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          content: "Network error occurred while contacting AI service.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewSession = () => {
    setSessionId(undefined);
    setMessages([
      {
        id: "new-session-" + Date.now(),
        role: "assistant",
        content: "Started a fresh conversation. What health or booking topic would you like to explore?",
      },
    ]);
  };

  return (
    <StandardPageShell
      title="AI Clinical & Support Assistant"
      description="Interactive real-time assistant integrated with n8n workflow proxy and automated clinical triage."
      breadcrumbs={[
        { label: "Dashboard", href: "/consumer" },
        { label: "AI Health Chat" },
      ]}
      actions={
        <button
          onClick={handleNewSession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus size={14} /> New Conversation
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[680px]">
        {/* Sidebar Info & Suggested Topics */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
              <Sparkles size={16} className="text-blue-500" />
              <span>Session Overview</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each AI response consumes 2 credits. Connected to live n8n webhook proxy with automated fallback.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active & Ready
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex-1 flex flex-col">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Suggested Prompts
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset)}
                  disabled={isSending}
                  className="w-full text-left p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700/60 transition-all text-slate-700 dark:text-slate-300"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Box */}
        <div className="lg:col-span-3 flex flex-col rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  MasterFlow AI Assistant
                </h2>
                <p className="text-[10px] text-slate-400">Powered by n8n & Vercel AI SDK</p>
              </div>
            </div>

            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium">
              HIPAA & GDPR Compliant
            </span>
          </div>

          {/* Messages History Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isUser
                        ? "bg-slate-800 text-white dark:bg-slate-700"
                        : "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                    }`}
                  >
                    {isUser ? <User size={15} /> : <Bot size={15} />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Bot size={15} />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about symptoms, appointment booking, or doctors..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/30"
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
