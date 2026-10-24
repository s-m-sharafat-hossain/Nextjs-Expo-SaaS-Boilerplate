// apps/web/src/app/api/v1/cms/help/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { HelpRepository } from "@/shared/cms/help.repository";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createHelpSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  category: z.string().default("Getting Started"),
  content: z.string().min(10),
  isPublished: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const query = searchParams.get("q") || undefined;
  const publishedOnly = searchParams.get("all") !== "true";

  try {
    const articles = await HelpRepository.findMany({ category, query, publishedOnly });
    return ApiResponse.success(articles, "Help articles retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to load help articles", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const body = await req.json();
    const parsed = createHelpSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.errors[0]?.message || "Invalid payload", 400);
    }

    const article = await HelpRepository.create(parsed.data);
    return ApiResponse.success(article, "Help article created", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to create help article", 500);
  }
}
