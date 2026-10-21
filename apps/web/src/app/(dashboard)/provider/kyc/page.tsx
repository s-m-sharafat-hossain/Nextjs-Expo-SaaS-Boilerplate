// apps/web/src/app/(dashboard)/provider/kyc/page.tsx
"use client";

import { useState } from "react";
import {
  FileCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  ExternalLink,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

export default function ProviderKycPage() {
  const terms = useRoleTerminology("PROVIDER");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [kycData, setKycData] = useState({
    status: "APPROVED",
    documentType: "Medical License & Board Certification",
    documentNumber: "MED-NY-849201",
    frontUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    submittedAt: "2026-10-20 14:30",
    reviewedAt: "2026-10-21 09:00",
  });

  const [docType, setDocType] = useState("MEDICAL_LICENSE");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [docUrl, setDocUrl] = useState("");

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setKycData({
      status: "PENDING",
      documentType: docType,
      documentNumber: licenseNumber,
      frontUrl: docUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      submittedAt: "Just now",
      reviewedAt: "Pending",
    });
    setFeedbackMsg("Your credentials have been submitted for administrator review.");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <StandardPageShell
      title="Identity & License Verification (KYC)"
      description={`To protect patients and maintain clinical quality, all ${terms.providerUnitName.toLowerCase()}s must undergo regulatory license and identity verification before accepting public bookings.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: "KYC Verification" },
      ]}
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Verification Status Banner */}
        <div
          className={`p-5 rounded-2xl border flex items-start gap-4 ${
            kycData.status === "APPROVED"
              ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
              : kycData.status === "PENDING"
              ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl ${
              kycData.status === "APPROVED"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
            }`}
          >
            {kycData.status === "APPROVED" ? <Shield size={24} /> : <Clock size={24} />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {kycData.status === "APPROVED"
                  ? "Verified Practitioner Status Active"
                  : "Verification In Progress"}
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  kycData.status === "APPROVED"
                    ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
                    : "bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100"
                }`}
              >
                {kycData.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {kycData.status === "APPROVED"
                ? "Your official medical license has been verified. Your public services are live and can be booked by patients."
                : "Your documents are currently queued for administrator review. Reviews typically complete within 12-24 hours."}
            </p>
          </div>
        </div>

        {/* Existing Document Info */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="text-blue-600" size={18} />
            Verified Regulatory Credentials
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Document Type</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {kycData.documentType}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">License / State Board Reg #</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {kycData.documentNumber}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Uploaded Document
            </span>
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video max-h-48">
              <img
                src={kycData.frontUrl}
                alt="License Certificate"
                className="w-full h-full object-cover"
              />
              <a
                href={kycData.frontUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2 px-3 py-1 bg-black/75 hover:bg-black text-white text-xs rounded-lg flex items-center gap-1 backdrop-blur-xs"
              >
                <ExternalLink size={12} /> View Certificate
              </a>
            </div>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
