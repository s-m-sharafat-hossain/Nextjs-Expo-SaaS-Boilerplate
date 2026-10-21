// apps/web/src/features/portals/consumer-portal/consumer.repository.ts
import { prisma } from "@/shared/lib/db";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import {
  ExploreServicesFilterInput,
  CreateBookingInput,
  SubmitReviewInput,
} from "./consumer.schema";

export class ConsumerRepository {
  /**
   * Consumer Overview KPIs
   */
  static async getDashboardStats(consumerId: string) {
    const [user, upcomingBookingsCount, completedBookingsCount, paymentsAgg] = await Promise.all([
      prisma.user.findUnique({
        where: { id: consumerId },
        select: { credits: true, plan: true },
      }),
      prisma.bookingOrder.count({
        where: {
          consumerId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.PENDING] },
        },
      }),
      prisma.bookingOrder.count({
        where: {
          consumerId,
          status: BookingStatus.COMPLETED,
        },
      }),
      prisma.paymentTransaction.aggregate({
        where: { userId: consumerId, status: PaymentStatus.PAID },
        _sum: { finalAmount: true },
      }),
    ]);

    return {
      credits: user?.credits ?? 0,
      plan: user?.plan ?? "FREE",
      upcomingBookingsCount: upcomingBookingsCount ?? 0,
      completedBookingsCount: completedBookingsCount ?? 0,
      totalSpent: paymentsAgg?._sum?.finalAmount ?? 0,
    };
  }

  /**
   * Explore Services catalog with search, category and price filtering
   */
  static async getExploreServices(filter: ExploreServicesFilterInput) {
    const where: any = { isActive: true };

    if (filter.category && filter.category.trim() !== "" && filter.category.toLowerCase() !== "all") {
      where.category = { equals: filter.category.trim(), mode: "insensitive" };
    }

    if (filter.search && filter.search.trim()) {
      where.OR = [
        { title: { contains: filter.search.trim(), mode: "insensitive" } },
        { description: { contains: filter.search.trim(), mode: "insensitive" } },
      ];
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (filter.minPrice !== undefined && !isNaN(filter.minPrice)) {
        priceFilter.gte = Number(filter.minPrice);
      }
      if (filter.maxPrice !== undefined && !isNaN(filter.maxPrice)) {
        priceFilter.lte = Number(filter.maxPrice);
      }
      if (Object.keys(priceFilter).length > 0) {
        where.price = priceFilter;
      }
    }

    const [total, services] = await Promise.all([
      prisma.listingService.count({ where }),
      prisma.listingService.findMany({
        where,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
        orderBy: { createdAt: "desc" },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
              kycStatus: true,
              providerReviews: {
                select: { rating: true },
              },
            },
          },
        },
      }),
    ]);

    // Enhance services with computed provider average rating and flat UI props
    const formattedServices = services.map((s: any) => {
      const reviews = s.provider?.providerReviews || [];
      const avgRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) /
                reviews.length
              ).toFixed(1)
            )
          : 5.0;

      return {
        ...s,
        serviceTitle: s.title,
        providerId: s.providerId,
        providerName: s.provider?.name || "Specialist",
        providerAvatar: s.provider?.image || "",
        providerTitle: s.provider?.bio || s.category,
        kycVerified: s.provider?.kycStatus === "VERIFIED",
        rating: avgRating,
        reviewsCount: reviews.length,
        provider: {
          ...s.provider,
          rating: avgRating,
          reviewCount: reviews.length,
        },
      };
    });

    return {
      total,
      services: formattedServices,
      page: filter.page,
      totalPages: Math.ceil(total / filter.limit),
    };
  }

  /**
   * Get Service by ID
   */
  static async getServiceById(id: string) {
    return prisma.listingService.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            kycStatus: true,
          },
        },
      },
    });
  }

  /**
   * Create Booking Order (Calculates split and adds to provider pending balance)
   */
  static async createBooking(consumerId: string, input: CreateBookingInput) {
    const service = await prisma.listingService.findUnique({
      where: { id: input.serviceId },
      include: { provider: true },
    });

    if (!service) throw new Error("Service not found");

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const platformFee = Number((service.price * 0.15).toFixed(2));
    const providerEarning = Number((service.price - platformFee).toFixed(2));

    return prisma.$transaction(async (tx: any) => {
      const booking = await tx.bookingOrder.create({
        data: {
          orderNumber,
          serviceId: service.id,
          providerId: service.providerId,
          consumerId,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          scheduledAt: new Date(input.scheduledAt),
          durationMin: service.durationMinutes,
          amount: service.price,
          platformFee,
          providerEarning,
          currency: service.currency,
          notes: input.notes,
        },
      });

      // Update provider wallet with pending escrow
      await tx.wallet.upsert({
        where: { userId: service.providerId },
        create: {
          userId: service.providerId,
          balance: 0,
          pendingBalance: providerEarning,
          currency: service.currency,
        },
        update: {
          pendingBalance: { increment: providerEarning },
        },
      });

      return booking;
    });
  }

  /**
   * Get Consumer's Bookings
   */
  static async getBookings(consumerId: string, status?: BookingStatus) {
    return prisma.bookingOrder.findMany({
      where: {
        consumerId,
        ...(status ? { status } : {}),
      },
      include: {
        service: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });
  }

  /**
   * Cancel Booking
   */
  static async cancelBooking(consumerId: string, bookingId: string, reason?: string) {
    const booking = await prisma.bookingOrder.findFirst({
      where: { id: bookingId, consumerId },
    });

    if (!booking) throw new Error("Booking not found or not authorized");

    return prisma.bookingOrder.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        notes: reason ? `Cancelled by user: ${reason}` : booking.notes,
      },
    });
  }

  /**
   * Submit Review
   */
  static async submitReview(consumerId: string, input: SubmitReviewInput) {
    return prisma.review.create({
      data: {
        consumerId,
        providerId: input.providerId,
        bookingId: input.bookingId,
        rating: input.rating,
        comment: input.comment,
      },
    });
  }
}
