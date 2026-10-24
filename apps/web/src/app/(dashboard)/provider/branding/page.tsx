// apps/web/src/app/(dashboard)/provider/branding/page.tsx
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { BrandingService } from "@/features/branding/branding.service";

export const metadata = {
  title: "White-Labeling & Custom Branding — SaaSFlow Pro",
  description: "Connect custom domains, customize portal colors, logos, and tenant themes.",
};

export default async function BrandingSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch or find workspace for user
  const member = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: { customDomain: true },
      },
    },
  });

  const workspace = member?.workspace || {
    id: "default-ws",
    name: "Acme Corporation",
    slug: "acme",
    logoUrl: null,
    customDomain: null,
  };

  const branding = await BrandingService.getBranding(workspace.id);

  return (
    <StandardPageShell
      title="White-Labeling & Domain Branding"
      description="Customize your portal's visual appearance and connect a custom branded domain with automated SSL."
    >
      <div className="space-y-8 max-w-5xl">
        {/* 1. Custom Domain Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>🌐</span> Custom Domain Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Point your own domain (e.g. <code>portal.yourcompany.com</code>) to your workspace.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  workspace.customDomain?.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                }`}
              >
                {workspace.customDomain?.status || "NOT CONNECTED"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Custom Domain
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={workspace.customDomain?.domain || ""}
                    placeholder="portal.mycompany.com"
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition">
                    Save Domain
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Required DNS Record:
                </div>
                <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  Type: <strong>CNAME</strong><br />
                  Host: <strong>portal</strong><br />
                  Target: <strong>cname.saasflow.app</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  SSL certificate is automatically provisioned via Let's Encrypt within 5 minutes of DNS propagation.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Domain Status Check
                </h4>
                <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>CNAME Target:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">cname.saasflow.app</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Certificate:</span>
                    <span className="font-semibold text-emerald-600">Auto-Managed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenant Subdomain:</span>
                    <span className="font-mono">{workspace.slug}.saasflow.app</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition">
                Verify DNS Propagation
              </button>
            </div>
          </div>
        </div>

        {/* 2. Brand Identity & Styling */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎨</span> Brand Identity & Custom Styling
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Apply your logo, brand colors, and support contact details across all portal pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Company / Portal Name
                </label>
                <input
                  type="text"
                  defaultValue={branding?.companyName || workspace.name}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  defaultValue={branding?.logoUrl || ""}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue={branding?.primaryColor || "#4f46e5"}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                    />
                    <span className="font-mono text-xs">{branding?.primaryColor || "#4f46e5"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue={branding?.accentColor || "#ec4899"}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                    />
                    <span className="font-mono text-xs">{branding?.accentColor || "#ec4899"}</span>
                  </div>
                </div>
              </div>

              <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Save Branding Changes
              </button>
            </div>

            {/* Live Preview Card */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Live Portal Header Preview
              </label>
              <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: branding?.primaryColor || "#4f46e5" }}
                    >
                      {branding?.companyName ? branding.companyName.charAt(0) : "A"}
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {branding?.companyName || workspace.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-xs"
                      style={{ backgroundColor: branding?.primaryColor || "#4f46e5" }}
                    >
                      Dashboard
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl text-[11px] text-slate-500 space-y-1">
                  <div>✓ Logo & Favicon injected in HTML headers</div>
                  <div>✓ CSS custom properties <code>--brand-primary</code> and <code>--brand-accent</code> assigned</div>
                  <div>✓ White-label transactional emails use workspace branding</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
