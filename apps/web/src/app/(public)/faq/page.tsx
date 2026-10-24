// apps/web/src/app/(public)/faq/page.tsx
import Link from "next/link";
import { FaqRepository } from "@/shared/cms/faq.repository";

export const metadata = {
  title: "Frequently Asked Questions — SaaSFlow Pro",
  description: "Find instant answers to questions regarding subscriptions, billing, API usage, and onboarding.",
};

const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "What is SaaSFlow Pro?",
    answer: "SaaSFlow Pro is a production-grade enterprise SaaS and marketplace boilerplate built on Next.js 16, Prisma 6, and PostgreSQL with native multi-tenancy, Stripe billing, and AI engine integrations.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "How does subscription billing and usage metering work?",
    answer: "We support both flat-rate tiered subscriptions (Free, Starter, Pro, Agency) and metered usage billing (API calls, AI tokens, compute seconds) calculated via Stripe Billing and local ledger fallback.",
    category: "Billing",
  },
  {
    id: "faq-3",
    question: "Can I connect my own custom domain?",
    answer: "Yes! Every workspace can connect their own branded custom domain (e.g. app.mycompany.com) with automatic SSL provisioning and instant DNS propagation checking.",
    category: "Domains & White-label",
  },
  {
    id: "faq-4",
    question: "What security measures are implemented?",
    answer: "SaaSFlow includes Redis token-bucket rate limiting, CSRF tokens, TOTP two-factor authentication, AES-256 encrypted PII at rest, and automated security audit logging.",
    category: "Security",
  },
  {
    id: "faq-5",
    question: "How do I invite team members to my workspace?",
    answer: "Navigate to your Workspace Settings > Members tab and click 'Invite Member'. You can assign specific roles: Owner, Admin, Member, or Viewer.",
    category: "Team & Collaboration",
  },
];

export default async function FaqPage() {
  let dbFaqs: any[] = [];
  try {
    dbFaqs = await FaqRepository.findMany({ publishedOnly: true });
  } catch {
    dbFaqs = [];
  }

  const faqs = dbFaqs.length > 0 ? dbFaqs : DEFAULT_FAQS;

  // Group by category
  const categories = Array.from(new Set(faqs.map((f) => f.category || "General")));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
            <span>⚡ SaaSFlow</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">Blog</Link>
            <Link href="/faq" className="text-indigo-600 font-semibold">FAQ</Link>
            <Link href="/help" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">Help Center</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition">
              Sign In
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full border border-purple-200 dark:border-purple-800/50 mb-4">
          Answers & Help
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Everything you need to know about SaaSFlow Pro, pricing plans, architecture, and team features.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
        {categories.map((category) => {
          const categoryFaqs = faqs.filter((f) => (f.category || "General") === category);
          return (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span>{category}</span>
              </h2>

              <div className="space-y-3">
                {categoryFaqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 open:shadow-sm transition-all"
                  >
                    <summary className="font-semibold text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between gap-4">
                      <span>{faq.question}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-16 p-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-center space-y-4">
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200">
            Still have questions?
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 max-w-md mx-auto">
            Our support team is available 24/7. Open a ticket or explore our extensive knowledge base.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/help"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
            >
              Browse Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
