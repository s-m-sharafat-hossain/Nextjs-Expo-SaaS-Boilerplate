// apps/web/src/app/(dashboard)/admin/analytics/page.tsx
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Analytics Dashboard — SaaSFlow Pro",
  description: "Real-time platform analytics, event tracking, conversion funnels, and queue health.",
};

async function getAnalytics() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/v1/admin/analytics?view=overview`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const data = await getAnalytics();
  const analytics = data?.analytics;
  const queueHealth = data?.queueHealth;

  return (
    <StandardPageShell
      title="Analytics Dashboard"
      description="Real-time platform events, conversions, funnel analysis, and queue health."
    >
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Events",
            value: analytics?.totalEvents ?? "—",
            icon: "📊",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: "Active Sessions",
            value: analytics?.totalSessions ?? "—",
            icon: "👥",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-950/30",
          },
          {
            label: "Conversions",
            value: analytics?.conversions ?? "—",
            icon: "🎯",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-950/30",
          },
          {
            label: "Queue Health",
            value: queueHealth?.status === "healthy" ? "Healthy ✅" : "Degraded ⚠️",
            icon: "⚙️",
            color: queueHealth?.status === "healthy" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
            bg: queueHealth?.status === "healthy" ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-amber-50 dark:bg-amber-950/30",
          },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border border-slate-200 ${stat.bg} p-4 dark:border-slate-700`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{String(stat.value)}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Actions */}
      {analytics?.topActions && analytics.topActions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Top Events</h2>
          <div className="space-y-2">
            {analytics.topActions.map((item: { action: string; count: number }, idx: number) => {
              const maxCount = analytics.topActions[0]?.count || 1;
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.action} className="flex items-center gap-3">
                  <span className="w-4 text-right text-xs text-slate-400">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {item.action}
                      </span>
                      <span className="text-xs text-slate-400">{item.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Funnel Analysis */}
      {analytics?.funnels && analytics.funnels.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Conversion Funnels</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analytics.funnels.map((funnel: { key: string; name: string; steps: Array<{ step: string; count: number }> }) => (
              <div key={funnel.key} className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{funnel.name}</p>
                {funnel.steps.map((step, si) => {
                  const maxCount = funnel.steps[0]?.count || 1;
                  const pct = maxCount > 0 ? Math.round((step.count / maxCount) * 100) : 0;
                  return (
                    <div key={step.step} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{step.step.replace(/_/g, " ")}</span>
                        <span>{step.count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Health */}
      {queueHealth && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Background Queues</h2>
            <span className="text-xs text-slate-400">Error Rate: {queueHealth.errorRate}</span>
          </div>
          {queueHealth.queuesDetails && queueHealth.queuesDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Queue", "Waiting", "Active", "Completed", "Failed"].map((h) => (
                      <th key={h} className="pb-2 text-left font-medium text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queueHealth.queuesDetails.map((q: any) => (
                    <tr
                      key={q.queueName}
                      className="border-b border-slate-50 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-2 font-medium text-slate-700 dark:text-slate-300">{q.queueName}</td>
                      <td className="py-2 text-slate-500">{q.waiting}</td>
                      <td className="py-2 text-blue-600">{q.active}</td>
                      <td className="py-2 text-green-600">{q.completed}</td>
                      <td className={`py-2 font-medium ${q.failed > 0 ? "text-red-500" : "text-slate-400"}`}>
                        {q.failed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No queue data available</p>
          )}
        </div>
      )}

      {!data && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Analytics data unavailable. Ensure the API is running.</p>
        </div>
      )}
    </StandardPageShell>
  );
}
