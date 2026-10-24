// apps/web/src/shared/cms/faq.repository.ts
import { prisma } from "@/shared/lib/prisma";

export interface FaqItemDTO {
  id?: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isPublished?: boolean;
}

export class FaqRepository {
  static async findMany(options: { category?: string; publishedOnly?: boolean } = {}) {
    const { category, publishedOnly = true } = options;
    const where: any = {};

    if (publishedOnly) {
      where.isPublished = true;
    }
    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }

    return prisma.faqItem.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.faqItem.findUnique({ where: { id } });
  }

  static async create(data: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
    isPublished?: boolean;
  }) {
    return prisma.faqItem.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || "General",
        order: data.order ?? 0,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  static async update(id: string, data: Partial<FaqItemDTO>) {
    return prisma.faqItem.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.faqItem.delete({ where: { id } });
  }
}
