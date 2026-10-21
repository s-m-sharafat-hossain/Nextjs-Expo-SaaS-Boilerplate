// src/shared/components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Ticket,
  Calendar,
  MessageSquare,
  BarChart3,
  FileText,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { siteConfig } from "@shared/config";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
    badge: "New",
  },
  {
    title: "Credits",
    href: "/dashboard/credits",
    icon: Zap,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: Ticket,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-600 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">{siteConfig.name}</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">v1.0.0</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Users size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">John Doe</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Pro Plan</p>
              </div>
            </div>
            <button className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
