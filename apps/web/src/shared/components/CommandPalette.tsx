// apps/web/src/shared/components/CommandPalette.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Shield,
  Stethoscope,
  User,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  MessageSquare,
  Zap,
  BarChart3,
  LogOut,
  Layers,
} from "lucide-react";
import { siteConfig } from "@shared/config";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  // Toggle with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navigateTo = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full" loop>
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <Command.Input
              autoFocus
              placeholder="Type a command, jump to portal, or search features... (ESC to close)"
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <Command.List className="max-h-96 overflow-y-auto p-2 space-y-2 text-sm">
            <Command.Empty className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found. Try searching for "Admin", "Bookings", or "Wallet".
            </Command.Empty>

            {/* Portal Jump Links */}
            <Command.Group heading="Dedicated Role Portals" className="text-xs font-semibold text-gray-400 px-2 py-1">
              <Command.Item
                onSelect={() => navigateTo("/admin")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
              >
                <Shield className="w-4 h-4 text-rose-500" />
                <span className="flex-1 font-medium">{siteConfig.roleLabels.admin.portalTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  /admin
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/provider")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
              >
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <span className="flex-1 font-medium">{siteConfig.roleLabels.provider.portalTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  /provider
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/consumer")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 transition-colors"
              >
                <User className="w-4 h-4 text-blue-500" />
                <span className="flex-1 font-medium">{siteConfig.roleLabels.consumer.portalTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  /consumer
                </span>
              </Command.Item>
            </Command.Group>

            {/* Quick Navigation */}
            <Command.Group heading="Key Operations" className="text-xs font-semibold text-gray-400 px-2 py-1">
              <Command.Item
                onSelect={() => navigateTo("/provider/bookings")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Appointment & Booking Fulfillment</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/provider/payouts")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>Earnings Wallet & Payout Requests</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/admin/kyc")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Shield className="w-4 h-4 text-cyan-500" />
                <span>KYC Verification Approvals</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/consumer/chat")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span>AI Clinical & Support Chat</span>
              </Command.Item>
            </Command.Group>

            {/* Quick 1-Click Role Switch */}
            <Command.Group heading="1-Click Demo Switcher" className="text-xs font-semibold text-gray-400 px-2 py-1">
              {siteConfig.demoAccounts.map((account) => (
                <Command.Item
                  key={account.role}
                  onSelect={() => navigateTo(account.path)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="flex-1">{account.label}</span>
                  <span className="text-xs text-gray-400">{account.email}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Guide */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
            <span>Use ↑↓ to navigate</span>
            <span>Press Enter to select</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
