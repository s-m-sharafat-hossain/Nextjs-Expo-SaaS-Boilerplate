// apps/web/src/shared/layouts/StandardPageShell.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Download,
  Calendar as CalendarIcon,
  Table as TableIcon,
  LayoutGrid,
  Kanban as KanbanIcon,
  X,
  AlertTriangle,
  Inbox,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

export type ViewMode = "table" | "grid" | "kanban" | "calendar";

export interface KpiStat {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: any;
  subtext?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface StandardPageShellProps {
  // 1. Header & Breadcrumbs
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: React.ReactNode;

  // 2. Optional 4-Card KPI Stat Strip
  kpiStats?: KpiStat[];

  // 3. Filter & View Switcher Toolbar
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterSlot?: React.ReactNode;
  activeView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  allowedViews?: ViewMode[];
  onExport?: (format: "csv" | "json") => void;

  // 4. Content states
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;

  // Main children
  children: React.ReactNode;

  // 5. Slide-Over Detail/Edit Drawer
  drawerOpen?: boolean;
  onDrawerClose?: () => void;
  drawerTitle?: string;
  drawerContent?: React.ReactNode;
}

export function StandardPageShell({
  breadcrumbs = [],
  title,
  description,
  actions,
  kpiStats,
  searchPlaceholder = "Search records...",
  searchValue = "",
  onSearchChange,
  filterSlot,
  activeView = "table",
  onViewChange,
  allowedViews = ["table", "grid"],
  onExport,
  isLoading = false,
  isError = false,
  errorMessage = "An unexpected error occurred while fetching data.",
  onRetry,
  isEmpty = false,
  emptyTitle = "No records found",
  emptyDescription = "There are currently no items matching your criteria. Try adjusting filters or create a new record.",
  emptyAction,
  children,
  drawerOpen = false,
  onDrawerClose,
  drawerTitle = "Details & Editor",
  drawerContent,
}: StandardPageShellProps) {
  const [internalSearch, setInternalSearch] = useState(searchValue);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BREADCRUMB + DYNAMIC TITLE + PRIMARY CTA HEADER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          {/* Breadcrumb Trail */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 overflow-x-auto">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={`truncate ${isLast ? "font-semibold text-slate-800 dark:text-slate-200" : ""}`}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Title & Description */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Primary CTA Slot */}
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. OPTIONAL 4-CARD KPI STAT STRIP */}
      {/* ───────────────────────────────────────────────────────────── */}
      {kpiStats && kpiStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiStats.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label + idx}
                className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {kpi.label}
                  </span>
                  {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {kpi.value}
                  </span>
                  {kpi.change && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        kpi.isPositive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {kpi.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {kpi.change}
                    </span>
                  )}
                </div>

                {kpi.subtext && (
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{kpi.subtext}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. UNIFIED FILTER/SEARCH/DATE/EXPORT & VIEW-SWITCHER TOOLBAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(onSearchChange || filterSlot || onViewChange || onExport) && (
        <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Search Bar & Filters */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {onSearchChange && (
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={internalSearch}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}
            {filterSlot}
          </div>

          {/* Right: Export & View Mode Switcher */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {onExport && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onExport("csv")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Export records to CSV"
                >
                  <Download size={13} />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => onExport("json")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Export records to JSON"
                >
                  <Download size={13} />
                  <span>JSON</span>
                </button>
              </div>
            )}

            {/* View Switcher Segmented Control */}
            {onViewChange && allowedViews.length > 1 && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                {allowedViews.includes("table") && (
                  <button
                    onClick={() => onViewChange("table")}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === "table"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Table View"
                  >
                    <TableIcon size={14} />
                  </button>
                )}
                {allowedViews.includes("grid") && (
                  <button
                    onClick={() => onViewChange("grid")}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === "grid"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Grid / Card View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                )}
                {allowedViews.includes("kanban") && (
                  <button
                    onClick={() => onViewChange("kanban")}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === "kanban"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Kanban Board View"
                  >
                    <KanbanIcon size={14} />
                  </button>
                )}
                {allowedViews.includes("calendar") && (
                  <button
                    onClick={() => onViewChange("calendar")}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === "calendar"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Calendar View"
                  >
                    <CalendarIcon size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CONTENT SLOT WITH SKELETON, EMPTY STATE, & ERROR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div>
        {isLoading ? (
          // Standard Skeleton Loader
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-64 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl animate-pulse" />
            <div className="h-20 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg animate-pulse" />
          </div>
        ) : isError ? (
          // Error Boundary State
          <div className="p-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-semibold text-rose-900 dark:text-rose-200 text-base">
              Failed to load content
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300">{errorMessage}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                <RefreshCw size={13} /> Retry Operation
              </button>
            )}
          </div>
        ) : isEmpty ? (
          // Standardized Empty State
          <div className="p-12 rounded-xl bg-white dark:bg-[#111827] border border-dashed border-slate-300 dark:border-slate-800 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
              {emptyTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {emptyDescription}
            </p>
            {emptyAction && <div className="pt-2">{emptyAction}</div>}
          </div>
        ) : (
          // Normal Main Slot
          children
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. SLIDE-OVER DETAIL/EDIT DRAWER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onDrawerClose}
          />

          {/* Drawer content panel */}
          <div className="relative w-full sm:w-[500px] lg:w-[600px] h-full bg-white dark:bg-[#111827] shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {drawerTitle}
              </h2>
              <button
                onClick={onDrawerClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body Slot */}
            <div className="flex-1 p-6 overflow-y-auto">{drawerContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}
