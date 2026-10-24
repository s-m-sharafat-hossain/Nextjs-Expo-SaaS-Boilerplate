// apps/web/src/shared/cms/help.repository.ts
import { prisma } from "@/shared/lib/prisma";

export interface HelpArticleDTO {
  id?: string;
  slug: string;
  title: string;
  category?: string;
  content: string;
  isPublished?: boolean;
}

export class HelpRepository {
  static async findMany(options: { category?: string; query?: string; publishedOnly?: boolean } = {}) {
    const { category, query, publishedOnly = true } = options;
    const where: any = {};

    if (publishedOnly) {
      where.isPublished = true;
    }
    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    return prisma.helpArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.helpArticle.findUnique({
      where: { slug },
    });
  }

  static async create(data: HelpArticleDTO) {
    return prisma.helpArticle.create({
      data: {
        slug: data.slug,
        title: data.title,
        category: data.category || "Getting Started",
        content: data.content,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  static async update(id: string, data: Partial<HelpArticleDTO>) {
    return prisma.helpArticle.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.helpArticle.delete({ where: { id } });
  }

  static async voteHelpful(slug: string, helpful: boolean) {
    return prisma.helpArticle.update({
      where: { slug },
      data: helpful
        ? { helpfulYes: { increment: 1 } }
        : { helpfulNo: { increment: 1 } },
    });
  }
}
