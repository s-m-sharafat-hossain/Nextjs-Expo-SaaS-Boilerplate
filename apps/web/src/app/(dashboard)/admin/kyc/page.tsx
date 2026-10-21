// apps/web/src/app/(dashboard)/admin/kyc/page.tsx
"use client";

import { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface KycItem {
  id: string;
  providerName: string;
  email: string;
  role: string;
  documentType: string;
  documentNumber: string;
  frontUrl: string;
  backUrl?: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export default function AdminKycPage() {
  const terms = useRoleTerminology("ADMIN");
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [selectedDoc, setSelectedDoc] = useState<KycItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [kycList, setKycList] = useState<KycItem[]>([
    {
      id: "kyc-001",
      providerName: "Dr. Sarah Mitchell, MD",
      email: "provider@demo.com",
      role: "PROVIDER",
      documentType: "Medical License & Board Certification",
      documentNumber: "MED-NY-849201",
      frontUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      submittedAt: "2026-10-20 14:30",
      status: "PENDING",
    },
    {
      id: "kyc-002",
      providerName: "Dr. David Chen, MD",
      email: "david.chen@clinic.org",
      role: "PROVIDER",
      documentType: "State Board Medical License",
      documentNumber: "MED-CA-192834",
      frontUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
      submittedAt: "2026-10-19 09:15",
      status: "PENDING",
    },
    {
      id: "kyc-003",
      providerName: "Dr. Elena Rostova, PhD",
      email: "elena.r@neurocare.com",
      role: "PROVIDER",
      documentType: "Doctorate Degree & Clinical License",
      documentNumber: "CLIN-IL-554210",
      frontUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
      submittedAt: "2026-10-18 11:20",
      status: "APPROVED",
    },
  ]);

  const kpiStats = [
    {
      label: "Pending Verification",
      value: kycList.filter((k) => k.status === "PENDING").length.toString(),
      change: "Action required",
      isPositive: false,
      subtext: "Awaiting administrative review",
    },
    {
      label: "Approved Credentials",
      value: kycList.filter((k) => k.status === "APPROVED").length.toString(),
      change: "+100%",
      isPositive: true,
      subtext: "Verified practitioners",
    },
    {
      label: "Rejection Rate",
      value: "4.2%",
      change: "-1.5%",
      isPositive: true,
      subtext: "High applicant quality",
    },
    {
      label: "Avg. Turnaround Time",
      value: "4.5 hrs",
      change: "SLA < 12 hrs",
      isPositive: true,
      subtext: "Fast compliance workflow",
    },
  ];

  const handleApprove = (id: string) => {
    setKycList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "APPROVED" as const } : k))
    );
    setDrawerOpen(false);
    setFeedbackMsg(`Verification for ${selectedDoc?.providerName} approved successfully.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    setKycList((prev) =>
      prev.map((k) =>
        k.id === selectedDoc?.id
          ? { ...k, status: "REJECTED" as const, rejectionReason }
          : k
      )
    );
    setRejectionModalOpen(false);
    setDrawerOpen(false);
    setFeedbackMsg(`Verification for ${selectedDoc?.providerName} rejected.`);
    setRejectionReason("");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <StandardPageShell
      title="KYC Compliance & Verification Queue"
      description={`Review official license documents and identity records before ${terms.providerUnitName.toLowerCase()} accounts are authorized to accept bookings.`}
      breadcrumbs={[
        { label: "Governance", href: "/admin" },
        { label: "KYC Approvals" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      onExport={(fmt) => alert(`Exporting KYC audit ledger in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Document Inspection & Verification"
      drawerContent={
        selectedDoc ? (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                  {selectedDoc.providerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {selectedDoc.providerName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedDoc.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block">Document Type</span>
                  <span className="font-medium">{selectedDoc.documentType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">License / Reg #</span>
                  <span className="font-mono font-medium">{selectedDoc.documentNumber}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Submitted Document Preview
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/20 aspect-video relative flex items-center justify-center group">
                <img
                  src={selectedDoc.frontUrl}
                  alt="KYC Document Preview"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <a
                  href={selectedDoc.frontUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm transition-colors"
                >
                  <ExternalLink size={12} /> Open Full Resolution
                </a>
              </div>
            </div>

            {selectedDoc.status === "PENDING" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(selectedDoc.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 size={16} /> Approve & Verify
                </button>
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <XCircle size={16} /> Reject with Reason
                </button>
              </div>
            )}
          </div>
        ) : null
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* KYC Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="text-blue-600" size={18} />
            Applicant Submissions ({kycList.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Registration #</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {kycList.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                        {doc.providerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {doc.providerName}
                        </span>
                        <span className="text-[11px] text-slate-500">{doc.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {doc.documentType}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {doc.documentNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.submittedAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        doc.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : doc.status === "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                        setDrawerOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Reject KYC Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Please specify the precise regulatory or documentation deficiency so the applicant can re-upload.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Expired medical license date, blurry signature page, or name mismatch."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </StandardPageShell>
  );
}
