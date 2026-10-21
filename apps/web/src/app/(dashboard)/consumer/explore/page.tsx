// apps/web/src/app/(dashboard)/consumer/explore/page.tsx
"use client";

import { useState } from "react";
import {
  Search,
  Star,
  Clock,
  Shield,
  Calendar,
  CheckCircle2,
  DollarSign,
  Filter,
  ArrowRight,
  User,
  ExternalLink,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface SpecialistService {
  id: string;
  providerId: string;
  providerName: string;
  providerTitle: string;
  providerAvatar: string;
  serviceTitle: string;
  category: string;
  price: number;
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  kycVerified: boolean;
  description: string;
}

export default function ConsumerExplorePage() {
  const terms = useRoleTerminology("CONSUMER");
  const [activeView, setActiveView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SpecialistService | null>(null);
  const [scheduledAt, setScheduledAt] = useState("2026-10-22T14:00");
  const [intakeNotes, setIntakeNotes] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [services, setServices] = useState<SpecialistService[]>([
    {
      id: "srv-001",
      providerId: "prov-001",
      providerName: "Dr. Sarah Mitchell, MD",
      providerTitle: "Board-Certified Internal Medicine",
      providerAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
      serviceTitle: "Comprehensive Initial Medical Consultation",
      category: "Internal Medicine",
      price: 120.0,
      durationMinutes: 45,
      rating: 4.95,
      reviewsCount: 38,
      kycVerified: true,
      description: "Full clinical intake, symptom analysis, review of recent lab panels, and personalized treatment strategy.",
    },
    {
      id: "srv-002",
      providerId: "prov-002",
      providerName: "Dr. David Chen, MD",
      providerTitle: "Clinical Cardiologist & Vascular Specialist",
      providerAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
      serviceTitle: "Cardiovascular Health & ECG Review",
      category: "Cardiology",
      price: 180.0,
      durationMinutes: 45,
      rating: 4.88,
      reviewsCount: 26,
      kycVerified: true,
      description: "Comprehensive heart health evaluation, blood pressure monitoring assessment, and preventive cardiology plan.",
    },
    {
      id: "srv-003",
      providerId: "prov-003",
      providerName: "Dr. Elena Rostova, PhD",
      providerTitle: "Licensed Clinical Neuropsychologist",
      providerAvatar: "https://images.unsplash.com/photo-1594824813637-88f28d6501a3?w=400&auto=format&fit=crop&q=80",
      serviceTitle: "Cognitive Performance & Sleep Architecture Intake",
      category: "Neurology",
      price: 150.0,
      durationMinutes: 60,
      rating: 4.92,
      reviewsCount: 44,
      kycVerified: true,
      description: "Cognitive assessment, insomnia root-cause analysis, and non-pharmacological behavioral sleep interventions.",
    },
  ]);

  const categories = ["All", "Internal Medicine", "Cardiology", "Neurology"];

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.providerName.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingModalOpen(false);
    setFeedbackMsg(
      `Appointment confirmed with ${selectedService?.providerName} for ${new Date(
        scheduledAt
      ).toLocaleString()}! Details saved to 'My Appointments'.`
    );
    setIntakeNotes("");
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const openBookModal = (s: SpecialistService) => {
    setSelectedService(s);
    setBookingModalOpen(true);
  };

  return (
    <StandardPageShell
      title={`Find & Book Verified ${terms.providerPlural}`}
      description={`Explore vetted, board-certified specialists. Book direct video consultations, view transparent pricing, and receive digital prescriptions.`}
      breadcrumbs={[
        { label: "Care", href: "/consumer" },
        { label: `Find ${terms.providerPlural}` },
      ]}
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors, specialties, treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Specialist Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={s.providerAvatar}
                  alt={s.providerName}
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {s.providerName}
                    </h4>
                    {s.kycVerified && (
                      <span className="text-blue-600 dark:text-blue-400" title="Verified Practitioner">
                        <Shield size={14} />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{s.providerTitle}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.rating}</span>
                    <span className="text-slate-400 text-[11px]">({s.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60 mb-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  {s.category}
                </span>
                <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                  {s.serviceTitle}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-2">{s.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-slate-100">
                  ${s.price.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openBookModal(s)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Calendar size={13} /> Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal */}
      {bookingModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleBookAppointment}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="text-blue-600" size={18} />
                Book Consultation
              </h3>
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center gap-3">
              <img
                src={selectedService.providerAvatar}
                alt={selectedService.providerName}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-semibold text-xs text-blue-950 dark:text-blue-200">
                  {selectedService.providerName}
                </h4>
                <p className="text-[11px] text-blue-700 dark:text-blue-400">
                  {selectedService.serviceTitle} (${selectedService.price})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Select Date & Time Slot
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Symptoms & Intake Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={intakeNotes}
                  onChange={(e) => setIntakeNotes(e.target.value)}
                  placeholder="Describe your current symptoms or specific questions for the doctor..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Consultation Fee:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${selectedService.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Telemedicine Platform Fee:</span>
                  <span className="text-emerald-600 font-semibold">Included</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Booking (${selectedService.price})
              </button>
            </div>
          </form>
        </div>
      )}
    </StandardPageShell>
  );
}
