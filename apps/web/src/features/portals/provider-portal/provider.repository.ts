// apps/web/src/features/portals/provider-portal/provider.repository.ts
import { prisma } from "@/shared/lib/db";
import { BookingStatus, PayoutStatus } from "@prisma/client";
import { CreateServiceInput, UpdateServiceInput, AvailabilitySlotInput } from "./provider.schema";

export class ProviderRepository {
  /**
   * Provider Overview KPIs
   */
  static async getDashboardStats(providerId: string) {
    const [wallet, upcomingBookingsCount, completedBookingsCount, reviewsAgg] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId: providerId } }),
      prisma.bookingOrder.count({
        where: {
          providerId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        },
      }),
      prisma.bookingOrder.count({
        where: {
          providerId,
          status: BookingStatus.COMPLETED,
        },
      }),
      prisma.review.aggregate({
        where: { providerId },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    return {
      availableBalance: wallet?.balance || 0,
      pendingBalance: wallet?.pendingBalance || 0,
      totalEarned: wallet?.totalEarned || 0,
      currency: wallet?.currency || "USD",
      upcomingBookingsCount,
      completedBookingsCount,
      averageRating: reviewsAgg._avg?.rating || 5.0,
      totalReviews: reviewsAgg._count?._all || 0,
    };
  }

  /**
   * Get Services list for provider
   */
  static async getServices(providerId: string) {
    return prisma.listingService.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  /**
   * Create Service Listing
   */
  static async createService(providerId: string, data: CreateServiceInput) {
    const baseSlug = (data.slug || data.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    return prisma.listingService.create({
      data: {
        providerId,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        price: data.price,
        durationMinutes: data.durationMinutes,
        imageUrl: data.imageUrl || null,
        tags: data.tags || [],
      },
    });
  }

  /**
   * Update Service Listing
   */
  static async updateService(serviceId: string, providerId: string, data: Partial<UpdateServiceInput>) {
    const existing = await prisma.listingService.findFirst({
      where: { id: serviceId, providerId },
    });

    if (!existing) {
      throw new Error("Service not found or unauthorized");
    }

    return prisma.listingService.update({
      where: { id: serviceId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.durationMinutes ? { durationMinutes: data.durationMinutes } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {}),
        ...(data.tags ? { tags: data.tags } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });
  }

  /**
   * Delete Service Listing
   */
  static async deleteService(serviceId: string, providerId: string) {
    const existing = await prisma.listingService.findFirst({
      where: { id: serviceId, providerId },
    });

    if (!existing) {
      throw new Error("Service not found or unauthorized");
    }

    return prisma.listingService.delete({
      where: { id: serviceId },
    });
  }

  /**
   * Get Bookings for Provider
   */
  static async getBookings(providerId: string, status?: BookingStatus) {
    return prisma.bookingOrder.findMany({
      where: {
        providerId,
        ...(status ? { status } : {}),
      },
      include: {
        service: true,
        consumer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });
  }

  /**
   * Update Booking Status (with Escrow release on COMPLETED)
   */
  static async updateBookingStatus(
    bookingId: string,
    providerId: string,
    status: BookingStatus,
    cancellationReason?: string
  ) {
    return prisma.$transaction(async (tx: any) => {
      const booking = await tx.bookingOrder.findFirst({
        where: { id: bookingId, providerId },
        include: { provider: { include: { wallet: true } } },
      });

      if (!booking) throw new Error("Booking order not found or not authorized");

      const updatedBooking = await tx.bookingOrder.update({
        where: { id: bookingId },
        data: {
          status,
          notes: cancellationReason ? `Cancelled: ${cancellationReason}` : booking.notes,
        },
      });

      // Escrow release logic: When a booking is marked COMPLETED, release earnings to wallet balance
      if (status === BookingStatus.COMPLETED && booking.providerEarning > 0) {
        if (booking.provider.wallet) {
          await tx.wallet.update({
            where: { id: booking.provider.wallet.id },
            data: {
              balance: { increment: booking.providerEarning },
              pendingBalance: { decrement: booking.providerEarning },
              totalEarned: { increment: booking.providerEarning },
            },
          });
        }
      }

      return updatedBooking;
    });
  }

  /**
   * Get Availability Slots
   */
  static async getAvailabilitySlots(providerId: string) {
    return prisma.availabilitySlot.findMany({
      where: { providerId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }

  /**
   * Set Provider Availability Slots (batch replace)
   */
  static async setAvailabilitySlots(providerId: string, slots: AvailabilitySlotInput[]) {
    return prisma.$transaction(async (tx: any) => {
      await tx.availabilitySlot.deleteMany({
        where: { providerId },
      });

      if (slots.length === 0) return [];

      return tx.availabilitySlot.createMany({
        data: slots.map((s) => ({
          providerId,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isAvailable: true,
        })),
      });
    });
  }

  /**
   * Get Provider Wallet & Payout history
   */
  static async getWallet(providerId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: providerId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: providerId },
      });
    }

    const payouts = await prisma.payoutRequest.findMany({
      where: { userId: providerId },
      orderBy: { createdAt: "desc" },
    });

    return { wallet, payouts };
  }

  /**
   * Create Payout Request
   */
  static async createPayoutRequest(
    providerId: string,
    amount: number,
    payoutMethod: string,
    accountDetails: any
  ) {
    return prisma.$transaction(async (tx: any) => {
      let wallet = await tx.wallet.findUnique({
        where: { userId: providerId },
      });

      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient available balance for this payout request");
      }

      // Deduct from balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
        },
      });

      const platformFee = 0; // Payout fee can be configured
      const netAmount = amount - platformFee;

      return tx.payoutRequest.create({
        data: {
          userId: providerId,
          amount,
          platformFee,
          netAmount,
          currency: wallet.currency,
          payoutMethod,
          accountDetails,
          status: PayoutStatus.PENDING,
        },
      });
    });
  }
}
