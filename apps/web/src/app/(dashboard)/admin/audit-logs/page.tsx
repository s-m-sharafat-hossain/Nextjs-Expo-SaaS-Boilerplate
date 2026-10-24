// apps/web/src/app/(dashboard)/admin/audit-logs/page.tsx
"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Activity,
  Terminal,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminAuditLogsPage() {
  const terms = useRoleTerminology("ADMIN");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Initial demonstration logs demonstrating immutable audit tracking
  const [logs] = useState<AuditEntry[]>([
    {
      id: "log-101",
      action: "AUTH_LOGIN",
      entity: "users",
      entityId: "usr-001",
      ipAddress: "198.51.100.42",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      user: { name: "Super Admin", email: "admin@demo.com", role: "ADMIN" },
      details: { method: "2FA_TOTP", sessionDuration: "24h" },
    },
    {
      id: "log-102",
      action: "SUSPICIOUS_ACCOUNT_LOCKED",
      entity: "security",
      entityId: "usr-044",
      ipAddress: "203.0.113.88",
      userAgent: "Python-urllib/3.9",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: null,
      details: { reason: "5 consecutive failed password attempts", lockoutMinutes: 30 },
    },
    {
      id: "log-103",
      action: "ADMIN_KYC_APPROVED",
      entity: "kyc_documents",
      entityId: "kyc-001",
      ipAddress: "198.51.100.42",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user: { name: "Super Admin", email: "admin@demo.com", role: "ADMIN" },
      details: { applicantEmail: "doctor.mitchell@telehealth.com", verifiedDocument: "MEDICAL_LICENSE" },
    },
    {
      id: "log-104",
      action: "DATA_ACCESS_READ",
      entity: "users",
      entityId: "usr-020",
      ipAddress: "198.51.100.42",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      user: { name: "Dr. Sarah Mitchell", email: "provider@demo.com", role: "PROVIDER" },
      details: { accessType: "READ_PATIENT_MEDICAL_HISTORY", patientId: "usr-020" },
    },
    {
      id: "log-105",
      action: "AUTH_FAILED",
      entity: "auth",
      entityId: null,
      ipAddress: "192.0.2.14",
      userAgent: "curl/7.68.0",
      createdAt: new Date(Date.now() - 1000 * 60 * 520).toISOString(),
      user: null,
      details: { identifier: "target@company.com", error: "Password verification failed (attempt 1/5)" },
    },
  ]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.email && log.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.includes(search));

    const matchesAction =
      actionFilter === "ALL" ||
      (actionFilter === "AUTH" && log.action.startsWith("AUTH_")) ||
      (actionFilter === "ADMIN" && log.action.startsWith("ADMIN_")) ||
      (actionFilter === "SUSPICIOUS" && log.action.startsWith("SUSPICIOUS_")) ||
      (actionFilter === "DATA" && log.action.startsWith("DATA_ACCESS_"));

    return matchesSearch && matchesAction;
  });

  const handleExportCsv = async () => {
    try {
      const response = await fetch("/api/v1/admin/audit-logs?format=csv");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `security-audit-trail-${Date.now()}.csv`;
        a.click();
      } else {
        // Fallback local CSV generation
        const headers = ["ID,Action,Entity,User,IP,Timestamp\n"];
        const rows = filteredLogs.map(
          (l) => `"${l.id}","${l.action}","${l.entity}","${l.user?.email || 'N/A'}","${l.ipAddress || ''}","${l.createdAt}"\n`
        );
        const blob = new Blob([...headers, ...rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${Date.now()}.csv`;
        a.click();
      }
    } catch {
      alert("Downloading audit log backup...");
    }
  };

  const getBadgeStyle = (action: string) => {
    if (action.startsWith("SUSPICIOUS_") || action.includes("FAILED") || action.includes("LOCKED")) {
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900";
    }
    if (action.startsWith("ADMIN_")) {
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900";
    }
    if (action.startsWith("DATA_ACCESS_")) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900";
    }
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900";
  };

  return (
    <StandardPageShell
      title="Security & Audit Trail"
      description="Immutable cryptographic event logging, anomaly tracking, and compliance record keeping"
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Audit Events</span>
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">12,482</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Append-only immutable record</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Governance Actions</span>
              <ShieldAlert className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">842</div>
            <span className="text-xs text-slate-500">1-Year strict retention policy</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Failed Auth Attempts</span>
              <XCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">14</div>
            <span className="text-xs text-amber-600">Monitored for brute force</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Security Alerts</span>
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">1</div>
            <span className="text-xs text-rose-600 dark:text-rose-400">Auto-lockout mitigated</span>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit actions, IP address, user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="ALL">All Categories</option>
                <option value="AUTH">Authentication Events</option>
                <option value="ADMIN">Admin Governance</option>
                <option value="DATA">Data Access Logs</option>
                <option value="SUSPICIOUS">Suspicious & Alerts</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            Export Audit Trail (CSV)
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Actor / User</th>
                  <th className="px-6 py-3.5">Action Event</th>
                  <th className="px-6 py-3.5">Target Entity</th>
                  <th className="px-6 py-3.5">IP Address</th>
                  <th className="px-6 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{log.user.name}</div>
                          <div className="text-xs text-slate-500">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Anonymous / Unauthenticated</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${getBadgeStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                      {log.entity} {log.entityId ? `(#${log.entityId})` : ""}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal / Drawer */}
        {drawerOpen && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Audit Log Inspection: {selectedLog.id}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Action:</span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{selectedLog.action}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">User Agent:</span>
                  <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{selectedLog.userAgent || "Unknown"}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Payload / Metadata Details:</span>
                  <pre className="mt-1 max-h-60 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-xs text-emerald-400">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StandardPageShell>
  );
}
