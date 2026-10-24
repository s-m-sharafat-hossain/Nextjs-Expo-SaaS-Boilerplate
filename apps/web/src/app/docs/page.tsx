// apps/web/src/app/docs/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";
import { ShieldCheck, BookOpen, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading OpenAPI documentation...</p>
      </div>
    </div>
  ),
});

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then(setSpec)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Interactive API Documentation</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                OpenAPI 3.0 • Rate Limited • CSRF Protected • Bearer & HMAC Webhook Auth
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Raw OpenAPI JSON
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Back to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {spec ? (
            <SwaggerUI spec={spec} />
          ) : (
            <div className="flex h-64 items-center justify-center">
              <span className="text-sm text-slate-500">Initializing Swagger UI specification...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
