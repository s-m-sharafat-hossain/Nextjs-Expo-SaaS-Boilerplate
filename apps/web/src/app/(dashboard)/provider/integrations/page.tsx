// apps/web/src/app/(dashboard)/provider/integrations/page.tsx
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { WebhookRepository } from "@/features/integrations/webhook.repository";
import { PluginRegistry } from "@/shared/plugins/plugin-registry";

export const metadata = {
  title: "Integrations & Webhooks — SaaSFlow Pro",
  description: "Connect Zapier, Make.com, Slack, and manage outgoing event webhooks.",
};

export default async function IntegrationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const endpoints = await WebhookRepository.findEndpoints();
  const plugins = PluginRegistry.getAll();

  return (
    <StandardPageShell
      title="Integrations & Automations"
      description="Connect third-party tools, automate workflows via Zapier & Make, and subscribe to signed webhook events."
    >
      <div className="space-y-8">
        {/* 1. Pre-Built Integrations & Plugins */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Connected Apps & Plugins
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Manage active platform extensions and automation pipelines
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plugins.map((plugin) => (
              <div
                key={plugin.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {plugin.name}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      Active v{plugin.version}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {plugin.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Author: {plugin.author}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
                    Configure →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Webhook Endpoints Management */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Outgoing Webhooks (Zapier & Make.com)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Receive instant HTTP POST payloads signed with HMAC SHA-256 whenever events occur
              </p>
            </div>
            <div className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-mono font-semibold">
              X-SaaSFlow-Signature
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {endpoints.map((ep) => (
              <div key={ep.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {ep.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Events:</span>
                    <div className="flex gap-1">
                      {ep.events.map((ev) => (
                        <span key={ev} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Secret: <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{ep.secret.slice(0, 10)}••••••••</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    Created {new Date(ep.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}

            {endpoints.length === 0 && (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <div className="text-3xl">🔗</div>
                <p className="text-sm font-medium">No webhook endpoints registered yet.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Add an endpoint URL from your Zapier Webhooks trigger or Make.com custom webhook to receive live events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
