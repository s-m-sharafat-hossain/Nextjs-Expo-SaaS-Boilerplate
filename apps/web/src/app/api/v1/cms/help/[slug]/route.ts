// apps/web/src/app/api/v1/cms/help/[slug]/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { HelpRepository } from "@/shared/cms/help.repository";
import { auth } from "@/shared/lib/auth";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;

  try {
    const article = await HelpRepository.findBySlug(slug);
    if (!article) {
      return ApiResponse.error("Article not found", 404);
    }
    return ApiResponse.success(article, "Help article retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to load article", 500);
  }
}

/**
 * POST /api/v1/cms/help/[slug] - Vote helpful
 * Body: { helpful: true | false }
 */
export async function POST(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;
  try {
    const body = await req.json();
    const updated = await HelpRepository.voteHelpful(slug, Boolean(body.helpful));
    return ApiResponse.success(updated, "Feedback recorded");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to record feedback", 500);
  }
}

export async function PUT(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const article = await HelpRepository.findBySlug(slug);
    if (!article) return ApiResponse.error("Article not found", 404);

    const body = await req.json();
    const updated = await HelpRepository.update(article.id, body);
    return ApiResponse.success(updated, "Article updated");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to update article", 500);
  }
}

export async function DELETE(req: NextRequest, props: RouteProps) {
  const { slug } = await props.params;
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const article = await HelpRepository.findBySlug(slug);
    if (!article) return ApiResponse.error("Article not found", 404);

    await HelpRepository.delete(article.id);
    return ApiResponse.success(null, "Article deleted");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to delete article", 500);
  }
}
