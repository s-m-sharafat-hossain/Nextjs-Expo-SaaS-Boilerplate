// apps/web/src/shared/cms/blog.repository.ts
import { prisma } from "@/shared/lib/prisma";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  publishedAt: Date | null;
  updatedAt: Date;
  tags: string[];
  coverImage?: string | null;
  category?: string | null;
  readTimeMinutes?: number;
  viewCount?: number;
  isPublished: boolean;
}

export interface BlogFilter {
  published?: boolean;
  category?: string;
  tag?: string;
  authorId?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export class BlogRepository {
  /**
   * List blog posts with pagination and filters
   */
  static async findMany(filter: BlogFilter = {}) {
    const { published = true, category, tag, authorId, searchQuery, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (published !== undefined) {
      where.isPublished = published;
    }
    if (authorId) {
      where.authorId = authorId;
    }
    if (category) {
      where.category = { equals: category, mode: "insensitive" };
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { summary: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: { author: { select: { id: true, name: true, image: true } } },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { posts, total, page, limit };
  }

  static async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true, image: true } } },
    });
  }

  static async create(data: Omit<BlogPost, "id" | "updatedAt" | "viewCount">) {
    return prisma.blogPost.create({ data: { ...data } });
  }

  static async update(id: string, data: Partial<BlogPost>) {
    return prisma.blogPost.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }

  static async incrementViewCount(id: string) {
    return prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
