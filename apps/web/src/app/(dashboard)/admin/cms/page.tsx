// apps/web/src/app/(dashboard)/admin/cms/page.tsx
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { BlogRepository } from "@/shared/cms/blog.repository";
import { FaqRepository } from "@/shared/cms/faq.repository";
import { HelpRepository } from "@/shared/cms/help.repository";
import Link from "next/link";

export const metadata = {
  title: "CMS Management — SaaSFlow Pro Admin",
  description: "Publish and manage blog posts, FAQ items, and help center documentation.",
};

export default async function AdminCmsPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    redirect("/admin");
  }

  const [blogData, faqs, helpArticles] = await Promise.all([
    BlogRepository.findMany({ page: 1, limit: 50, published: undefined }),
    FaqRepository.findMany({ publishedOnly: false }),
    HelpRepository.findMany({ publishedOnly: false }),
  ]);

  return (
    <StandardPageShell
      title="Content Management System (CMS)"
      description="Manage public-facing blog posts, customer FAQs, and knowledge base documentation."
    >
      <div className="space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Blog Posts</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{blogData.total}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Published & Drafts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 text-xl font-bold">
              📝
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">FAQ Questions</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{faqs.length}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Active entries</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 text-xl font-bold">
              ❓
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Help Articles</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{helpArticles.length}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Knowledge base</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 text-xl font-bold">
              📚
            </div>
          </div>
        </div>

        {/* 1. Blog Posts Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Blog Articles</h2>
              <p className="text-sm text-slate-500">SEO-optimized announcements, tutorials, and changelogs</p>
            </div>
            <Link
              href="/blog"
              target="_blank"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition inline-flex items-center gap-2"
            >
              <span>View Public Blog ↗</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Title / Slug</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Views</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {blogData.posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      <div>{post.title}</div>
                      <div className="text-xs text-slate-400 font-mono">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                        {post.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                      {post.viewCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                          post.isPublished
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
                {blogData.posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No blog posts published yet. Use the API or seed scripts to publish your first post.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. FAQs Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions (FAQ)</h2>
              <p className="text-sm text-slate-500">Live questions shown on landing page and support pages</p>
            </div>
            <Link
              href="/faq"
              target="_blank"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              <span>View Public FAQ ↗</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 p-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {faq.question}
                  </h4>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-slate-600 dark:text-slate-300">
                    {faq.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {faq.answer}
                </p>
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="text-center text-slate-400 py-6 text-sm">No FAQ items defined.</p>
            )}
          </div>
        </div>

        {/* 3. Help Center Articles */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Help Center Documentation</h2>
              <p className="text-sm text-slate-500">Articles, tutorials, guides, and troubleshooting</p>
            </div>
            <Link
              href="/help"
              target="_blank"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold inline-flex items-center gap-1"
            >
              <span>View Knowledge Base ↗</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {helpArticles.map((article) => (
              <div key={article.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{article.title}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">/help/{article.slug}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                    {article.category}
                  </span>
                  <span>👍 {article.helpfulYes}</span>
                  <span>👎 {article.helpfulNo}</span>
                </div>
              </div>
            ))}
            {helpArticles.length === 0 && (
              <p className="text-center text-slate-400 py-8 text-sm">No help articles published yet.</p>
            )}
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
