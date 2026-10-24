// apps/web/src/app/api/v1/cms/faq/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { FaqRepository } from "@/shared/cms/faq.repository";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createFaqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().default("General"),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const publishedOnly = searchParams.get("all") !== "true";

  try {
    const items = await FaqRepository.findMany({ category, publishedOnly });
    return ApiResponse.success(items, "FAQ items retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to load FAQ items", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const body = await req.json();
    const parsed = createFaqSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.issues[0]?.message || "Invalid payload", 400);
    }

    const item = await FaqRepository.create(parsed.data);
    return ApiResponse.success(item, "FAQ item created", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to create FAQ item", 500);
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return ApiResponse.error("Missing FAQ ID", 400);

    const updated = await FaqRepository.update(id, data);
    return ApiResponse.success(updated, "FAQ item updated");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to update FAQ item", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN" && (session?.user as any)?.role !== "ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return ApiResponse.error("Missing FAQ ID", 400);

  try {
    await FaqRepository.delete(id);
    return ApiResponse.success(null, "FAQ item deleted");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to delete FAQ item", 500);
  }
}
