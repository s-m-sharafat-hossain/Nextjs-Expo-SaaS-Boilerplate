// apps/web/src/app/(public)/help/page.tsx
import Link from "next/link";
import { HelpRepository } from "@/shared/cms/help.repository";

export const metadata = {
  title: "Help Center & Documentation — SaaSFlow Pro",
  description: "Knowledge base, guides, setup documentation, and API troubleshooting.",
};

const DEFAULT_ARTICLES = [
  {
    id: "art-1",
    slug: "getting-started-quickstart",
    title: "Quickstart Guide: Setting up your first Workspace",
    category: "Getting Started",
    content: "Learn how to configure your organization workspace, configure member roles, set up billing, and connect your custom domain in less than 5 minutes.",
    helpfulYes: 48,
    helpfulNo: 2,
  },
  {
    id: "art-2",
    slug: "configuring-stripe-payments",
    title: "Configuring Stripe & Metered Billing",
    category: "Billing & Plans",
    content: "Step-by-step instructions for adding Stripe Secret Keys, Webhook Secrets, creating subscription products, and handling metered usage events.",
    helpfulYes: 34,
    helpfulNo: 1,
  },
  {
    id: "art-3",
    slug: "custom-domain-dns-setup",
    title: "Connecting a Custom Domain with CNAME Verification",
    category: "Domains & Hosting",
    content: "Configure DNS records at Cloudflare, GoDaddy, or Namecheap to point your custom subdomain or apex domain to SaaSFlow with automatic SSL.",
    helpfulYes: 29,
    helpfulNo: 0,
  },
  {
    id: "art-4",
    slug: "webhooks-and-zapier-integration",
    title: "Automating Workflows with Webhooks and Zapier / Make",
    category: "Integrations",
    content: "Subscribe to real-time events like user.created, payment.succeeded, and booking.confirmed via signed HMAC SHA-256 webhooks.",
    helpfulYes: 19,
    helpfulNo: 1,
  },
];

export default async function HelpCenterPage() {
  let dbArticles: any[] = [];
  try {
    dbArticles = await HelpRepository.findMany({ publishedOnly: true });
  } catch {
    dbArticles = [];
  }

  const articles = dbArticles.length > 0 ? dbArticles : DEFAULT_ARTICLES;
  const categories = Array.from(new Set(articles.map((a) => a.category || "General")));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
            <span>⚡ SaaSFlow</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">Blog</Link>
            <Link href="/faq" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">FAQ</Link>
            <Link href="/help" className="text-indigo-600 font-semibold">Help Center</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition">
              Sign In
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800/50 mb-4">
          Knowledge Base & Guides
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          How can we help you today?
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Search our knowledge base for setup documentation, tutorials, and troubleshooting tips.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const categoryArticles = articles.filter((a) => (a.category || "General") === category);
            return (
              <div
                key={category}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-normal text-slate-500">
                    {categoryArticles.length} articles
                  </span>
                </h3>

                <ul className="space-y-3">
                  {categoryArticles.map((article) => (
                    <li key={article.id} className="group">
                      <div className="font-medium text-sm text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                        {article.title}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {article.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
