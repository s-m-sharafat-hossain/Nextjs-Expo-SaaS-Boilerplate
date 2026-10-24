// apps/web/src/app/(public)/blog/[slug]/page.tsx
import Link from "next/link";
import { BlogRepository } from "@/shared/cms/blog.repository";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params;
  const post = await BlogRepository.findBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — SaaSFlow Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const post = await BlogRepository.findBySlug(slug);

  if (!post) {
    notFound();
  }

  // Increment view count asynchronously
  BlogRepository.incrementViewCount(post.id).catch(() => {});

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            ← Back to Blog
          </Link>
          <span className="text-xs text-slate-500">{post.readTimeMinutes || 5} min read</span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-4 text-center">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
            {post.category || "Article"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {post.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {post.summary}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
            <span>By {post.author?.name || "The SaaSFlow Team"}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.viewCount} views</span>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-6">
          <div className="whitespace-pre-wrap font-sans text-base leading-7">
            {post.content}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
