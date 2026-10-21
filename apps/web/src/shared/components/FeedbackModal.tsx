"use client";

import { useState } from "react";
import { MessageSquarePlus, Star, Send, X, Check } from "lucide-react";

interface FeedbackModalProps {
  userId?: string;
  userEmail?: string;
}

export function FeedbackModal({ userId, userEmail }: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"FEEDBACK" | "BUG" | "FEATURE">("FEEDBACK");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message,
          rating,
          userId,
          email: userEmail,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
          setMessage("");
        }, 1800);
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-xl backdrop-blur text-xs font-medium transition-all hover:scale-105"
      >
        <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
        <span>Feedback</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">Thank you for your feedback!</h3>
                <p className="text-xs text-slate-400 mt-1">Your response helps us improve SaaSFlow.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Share your feedback</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Report a bug, suggest an idea, or let us know your thoughts.</p>
                </div>

                {/* Type Selector */}
                <div className="grid grid-cols-3 gap-2">
                  {(["FEEDBACK", "BUG", "FEATURE"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        type === t
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold"
                          : "bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {t === "FEEDBACK" ? "General" : t === "BUG" ? "Bug Report" : "Feature Idea"}
                    </button>
                  ))}
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">How satisfied are you?</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-slate-600 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you liked or how we can do better..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg shadow-lg shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Sending..." : "Submit Feedback"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
