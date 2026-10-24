// apps/web/src/app/api/v1/cms/blog/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { BlogRepository } from "@/shared/cms/blog.repository";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createPostSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(20),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().optional(),
  readTimeMinutes: z.number().int().positive().optional(),
  isPublished: z.boolean().default(true),
});

/**
 * GET /api/v1/cms/blog - List blog posts with pagination
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const searchQuery = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const publishedOnly = searchParams.get("all") !== "true";

  try {
    const result = await BlogRepository.findMany({
      category,
      tag,
      searchQuery,
      page,
      limit,
      published: publishedOnly ? true : undefined,
    });

    return ApiResponse.success(result, "Blog posts retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to load posts", 500);
  }
}

/**
 * POST /api/v1/cms/blog - Create new blog post (admin only)
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden: Admin privileges required", 403);
  }

  try {
    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
    }

    const post = await BlogRepository.create({
      ...parsed.data,
      authorId: session!.user!.id!,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    });

    return ApiResponse.success(post, "Blog post created successfully", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to create post", 500);
  }
}
