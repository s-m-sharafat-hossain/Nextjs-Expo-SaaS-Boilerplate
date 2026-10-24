// apps/web/src/shared/components/ErrorBoundary.tsx
"use client";

import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, eventId: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log exception to Sentry
    const eventId = Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    this.setState({ eventId });
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, eventId: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 m-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              !
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                An unexpected error occurred while rendering this component. Our team has been notified.
              </p>
            </div>

            {this.state.eventId && (
              <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
                Incident ID: <span className="font-semibold text-slate-800 dark:text-slate-200">{this.state.eventId}</span>
              </div>
            )}

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="text-left bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs font-mono overflow-auto max-h-36">
                <summary className="cursor-pointer text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Stack trace
                </summary>
                <p className="text-rose-600 dark:text-rose-400 font-bold">{this.state.error.message}</p>
                <pre className="mt-1 text-slate-500 whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
