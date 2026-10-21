"use client";

import { useState, useEffect } from "react";
import { Sparkles, Bot, CreditCard, CheckCircle2, ChevronRight, X } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to SaaSFlow Pro!",
    description: "Your complete full-stack SaaS & AI starter is ready. Let's take a quick 30-second tour of what's inside.",
    icon: Sparkles,
    badge: "Getting Started",
  },
  {
    title: "n8n AI Agent Chatbot",
    description: "Power custom conversational agents directly through n8n automation workflows, with real-time credit deduction.",
    icon: Bot,
    badge: "AI Automation",
  },
  {
    title: "Stripe Billing & Credits",
    description: "Multi-tier subscription checkout, Stripe Customer Portal, and atomic credit wallet guards are pre-configured.",
    icon: CreditCard,
    badge: "Monetization",
  },
  {
    title: "You are all set!",
    description: "Check the API routes, add your keys in .env, and start shipping your SaaS in hours instead of weeks.",
    icon: CheckCircle2,
    badge: "Ready to Ship",
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("saasflow_onboarding_completed");
    if (!completed) {
      // Show onboarding after a short delay for smooth arrival
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("saasflow_onboarding_completed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative">
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-8 bg-indigo-500"
                  : i < currentStep
                  ? "w-4 bg-indigo-800"
                  : "w-4 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Icon className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
            {step.badge}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">{step.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleComplete}
            className="text-xs text-slate-500 hover:text-slate-300 font-medium"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <span>{currentStep === STEPS.length - 1 ? "Get Started" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
