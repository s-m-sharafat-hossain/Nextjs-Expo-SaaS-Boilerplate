// apps/web/src/app/(dashboard)/provider/services/page.tsx
"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  bookingsCount: number;
}

export default function ProviderServicesPage() {
  const terms = useRoleTerminology("PROVIDER");
  const [activeView, setActiveView] = useState<"table" | "grid">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Consultation");
  const [price, setPrice] = useState("120");
  const [duration, setDuration] = useState("45");

  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "srv-001",
      title: "Comprehensive Initial Medical Consultation",
      description: "Full clinical intake, symptom diagnosis, lab requisition review, and holistic treatment roadmap.",
      category: "Consultation",
      price: 120.0,
      durationMinutes: 45,
      isActive: true,
      bookingsCount: 24,
    },
    {
      id: "srv-002",
      title: "Follow-Up Prescription & Recovery Check",
      description: "Progress evaluation, medication adjustments, and follow-up lab reviews.",
      category: "Follow-Up",
      price: 75.0,
      durationMinutes: 30,
      isActive: true,
      bookingsCount: 18,
    },
    {
      id: "srv-003",
      title: "Urgent Care & Triage Assessment",
      description: "Same-day priority video consultation for non-emergency acute concerns.",
      category: "Urgent Care",
      price: 160.0,
      durationMinutes: 30,
      isActive: false,
      bookingsCount: 5,
    },
  ]);

  const kpiStats = [
    {
      label: `Active ${terms.serviceUnitName}s`,
      value: services.filter((s) => s.isActive).length.toString(),
      change: "+1 this month",
      isPositive: true,
      subtext: "Visible to public clients",
    },
    {
      label: "Average Price",
      value: `$${Math.round(
        services.reduce((acc, s) => acc + s.price, 0) / services.length
      )}.00`,
      change: "+8.5%",
      isPositive: true,
      subtext: "Across all categories",
    },
    {
      label: "Total Bookings Served",
      value: services.reduce((acc, s) => acc + s.bookingsCount, 0).toString(),
      change: "+14.2%",
      isPositive: true,
      subtext: "Fulfilled appointments",
    },
    {
      label: "Client Conversion",
      value: "68%",
      change: "+4.1%",
      isPositive: true,
      subtext: "From profile visits",
    },
  ];

  const handleToggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    setFeedbackMsg("Service visibility updated.");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                title,
                description,
                category,
                price: parseFloat(price) || 0,
                durationMinutes: parseInt(duration) || 30,
              }
            : s
        )
      );
      setFeedbackMsg("Service updated successfully.");
    } else {
      const newService: ServiceItem = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        title,
        description,
        category,
        price: parseFloat(price) || 0,
        durationMinutes: parseInt(duration) || 30,
        isActive: true,
        bookingsCount: 0,
      };
      setServices((prev) => [newService, ...prev]);
      setFeedbackMsg("New service created successfully.");
    }

    setModalOpen(false);
    setEditingService(null);
    setTitle("");
    setDescription("");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setCategory(service.category);
    setPrice(service.price.toString());
    setDuration(service.durationMinutes.toString());
    setModalOpen(true);
  };

  return (
    <StandardPageShell
      title={`${terms.serviceUnitName}s & Clinical Offerings`}
      description={`Manage your practice offerings, set consultation prices, specify appointment duration, and customize what ${terms.consumerUnitName.toLowerCase()}s can book.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: `${terms.serviceUnitName}s` },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["grid", "table"]}
      onExport={(fmt) => alert(`Exporting catalog in ${fmt.toUpperCase()}...`)}
      actions={
        <button
          type="button"
          onClick={() => {
            setEditingService(null);
            setTitle("");
            setDescription("");
            setPrice("120");
            setDuration("45");
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus size={14} /> New {terms.serviceUnitName}
        </button>
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Grid View */}
      {activeView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                s.isActive
                  ? "bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500/50"
                  : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    {s.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(s.id)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {s.isActive ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <ToggleRight size={18} /> Public
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                        <ToggleLeft size={18} /> Draft
                      </span>
                    )}
                  </button>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-1">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4">{s.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-base text-slate-900 dark:text-slate-100">
                    ${s.price.toFixed(2)}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <Clock size={12} /> {s.durationMinutes} min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Offering</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{s.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${s.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{s.durationMinutes} min</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-600">{s.bookingsCount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        s.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {s.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors text-xs font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveService}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="text-blue-600" size={18} />
                {editingService ? "Edit Service" : `Create New ${terms.serviceUnitName}`}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Comprehensive Initial Medical Consultation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-Up">Follow-Up</option>
                    <option value="Urgent Care">Urgent Care</option>
                    <option value="Specialist Intake">Specialist Intake</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Detailed Clinical Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what patients can expect, required lab preparation, or prerequisites..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                {editingService ? "Save Changes" : "Publish Service"}
              </button>
            </div>
          </form>
        </div>
      )}
    </StandardPageShell>
  );
}
