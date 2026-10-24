// apps/web/src/app/(public)/blog/page.tsx
import Link from "next/link";
import { BlogRepository } from "@/shared/cms/blog.repository";

export const metadata = {
  title: "Blog & Updates — SaaSFlow Pro",
  description: "Product announcements, engineering deep dives, tutorials, and business tips.",
};

const SAMPLE_POSTS = [
  {
    id: "sample-1",
    slug: "introducing-saasflow-next-gen-marketplace",
    title: "Introducing SaaSFlow Pro: Next-Gen SaaS & Multi-Vendor Marketplace Boilerplate",
    summary: "A production-grade, enterprise-ready boilerplate built on Next.js 16, Prisma 6, and Tailwind CSS with full multi-tenancy, real-time presence, and AI integrations.",
    category: "Announcements",
    readTimeMinutes: 5,
    publishedAt: new Date(),
    viewCount: 1420,
    tags: ["Next.js", "SaaS", "Architecture"],
  },
  {
    id: "sample-2",
    slug: "scaling-multi-tenant-postgres-neon",
    title: "How We Scale Multi-Tenant PostgreSQL with Neon and Prisma",
    summary: "Architecting row-level security, connection pooling, and workspace tenant isolation for zero-latency cross-region queries.",
    category: "Engineering",
    readTimeMinutes: 8,
    publishedAt: new Date(Date.now() - 86400000 * 3),
    viewCount: 890,
    tags: ["Database", "Postgres", "Performance"],
  },
  {
    id: "sample-3",
    slug: "securing-modern-saas-rate-limiting-csrf-2fa",
    title: "Securing Modern Web Apps: A Practical Guide to Rate Limiting, CSRF & 2FA",
    summary: "Comprehensive defense-in-depth security strategies implemented from proxy to database: Redis token buckets, TOTP auth, and encrypted PII.",
    category: "Security",
    readTimeMinutes: 6,
    publishedAt: new Date(Date.now() - 86400000 * 7),
    viewCount: 2150,
    tags: ["Security", "Authentication", "TypeScript"],
  },
];

export default async function BlogIndexPage() {
  let posts: any[] = [];
  try {
    const data = await BlogRepository.findMany({ page: 1, limit: 12, published: true });
    posts = data.posts;
  } catch (err) {
    posts = [];
  }

  const displayPosts = posts.length > 0 ? posts : SAMPLE_POSTS;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
            <span>⚡ SaaSFlow</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/blog" className="text-indigo-600 font-semibold">Blog</Link>
            <Link href="/faq" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">FAQ</Link>
            <Link href="/help" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">Help Center</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition">
              Sign In
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-800/50 mb-4">
          Insights & Updates
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          The SaaSFlow Engineering & Product Blog
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore architectural deep dives, product tutorials, business growth playbooks, and modern full-stack development.
        </p>
      </div>

      {/* Post Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 flex items-start justify-between">
                <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
                  {post.category || "Article"}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {post.readTimeMinutes || 5} min read
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <Link href={`/blog/${post.slug}`} className="font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Post →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
