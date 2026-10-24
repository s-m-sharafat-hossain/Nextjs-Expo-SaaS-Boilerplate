// apps/web/src/app/api/v1/cms/blog/[slug]/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { BlogRepository } from "@/shared/cms/blog.repository";
import { auth } from "@/shared/lib/auth";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;

  try {
    const post = await BlogRepository.findBySlug(slug);
    if (!post) {
      return ApiResponse.error("Blog post not found", 404);
    }

    // Increment view count asynchronously
    BlogRepository.incrementViewCount(post.id).catch(() => {});

    return ApiResponse.success(post, "Blog post retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to load post", 500);
  }
}

export async function PUT(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const post = await BlogRepository.findBySlug(slug);
    if (!post) {
      return ApiResponse.error("Post not found", 404);
    }

    const body = await req.json();
    const updated = await BlogRepository.update(post.id, body);
    return ApiResponse.success(updated, "Post updated successfully");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to update post", 500);
  }
}

export async function DELETE(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const post = await BlogRepository.findBySlug(slug);
    if (!post) {
      return ApiResponse.error("Post not found", 404);
    }

    await BlogRepository.delete(post.id);
    return ApiResponse.success(null, "Post deleted successfully");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to delete post", 500);
  }
}
