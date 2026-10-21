// apps/web/prisma/seed.ts
import fs from "fs";
import path from "path";

// Native zero-dependency .env loader
try {
  const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env"),
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
} catch {}

import {
  PrismaClient,
  Role,
  PlanType,
  BookingStatus,
  PaymentStatus,
  KycStatus,
  WorkspaceRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Master SaaS Database Seeding...");

  // 1. Seed Demo Workspaces
  const defaultWorkspace = await prisma.workspace.upsert({
    where: { slug: "master-demo-workspace" },
    update: {},
    create: {
      name: "Apex Global Health & Services",
      slug: "master-demo-workspace",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
    },
  });

  // 2. Seed Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {
      role: Role.ADMIN,
      kycStatus: KycStatus.VERIFIED,
    },
    create: {
      email: "admin@demo.com",
      name: "Super Administrator",
      role: Role.ADMIN,
      plan: PlanType.AGENCY,
      credits: 9999,
      referralCode: "REF-ADMIN-APEX",
      kycStatus: KycStatus.VERIFIED,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });

  // 3. Seed Provider (Doctor / Vendor) User
  const providerUser = await prisma.user.upsert({
    where: { email: "provider@demo.com" },
    update: {
      role: Role.PROVIDER,
      kycStatus: KycStatus.VERIFIED,
    },
    create: {
      email: "provider@demo.com",
      name: "Dr. Sarah Mitchell, MD",
      role: Role.PROVIDER,
      plan: PlanType.PRO,
      credits: 500,
      referralCode: "REF-DR-SARAH",
      kycStatus: KycStatus.VERIFIED,
      bio: "Board-certified Specialist with 12+ years experience in Tele-consultation & Digital Healthcare.",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1594824813627-4a64e9a039d9?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });

  // Provider Wallet
  await prisma.wallet.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      balance: 1420.50,
      pendingBalance: 240.00,
      totalEarned: 3890.00,
      totalWithdrawn: 2229.50,
      currency: "USD",
    },
  });

  // Provider Availability Slots (Mon-Fri 09:00 - 17:00)
  for (let day = 1; day <= 5; day++) {
    const existingSlot = await prisma.availabilitySlot.findFirst({
      where: { providerId: providerUser.id, dayOfWeek: day },
    });
    if (!existingSlot) {
      await prisma.availabilitySlot.create({
        data: {
          providerId: providerUser.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      });
    }
  }

  // 4. Seed Consumer (Patient / Customer) User
  const consumerUser = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {
      role: Role.CONSUMER,
    },
    create: {
      email: "user@demo.com",
      name: "Alex Morgan",
      role: Role.CONSUMER,
      plan: PlanType.STARTER,
      credits: 35,
      referralCode: "REF-ALEX-M",
      kycStatus: KycStatus.VERIFIED,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });

  // Workspace memberships
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: defaultWorkspace.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: defaultWorkspace.id,
      userId: adminUser.id,
      role: WorkspaceRole.OWNER,
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: defaultWorkspace.id,
        userId: providerUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: defaultWorkspace.id,
      userId: providerUser.id,
      role: WorkspaceRole.MEMBER,
    },
  });

  // 5. Seed Listing Services for Provider
  const service1 = await prisma.listingService.upsert({
    where: { slug: "comprehensive-virtual-consultation" },
    update: {},
    create: {
      providerId: providerUser.id,
      title: "Comprehensive Health & Specialist Review",
      slug: "comprehensive-virtual-consultation",
      description: "One-on-one 45-minute tele-health clinical consultation, prescription review, and digital lab referral.",
      category: "Telehealth Consultation",
      price: 120.0,
      currency: "USD",
      durationMinutes: 45,
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&h=400&q=80",
      tags: ["Doctor", "Virtual Visit", "Prescription", "Health Check"],
      isActive: true,
    },
  });

  const service2 = await prisma.listingService.upsert({
    where: { slug: "rapid-second-opinion-triage" },
    update: {},
    create: {
      providerId: providerUser.id,
      title: "Rapid Clinical Second Opinion & Diagnostics",
      slug: "rapid-second-opinion-triage",
      description: "Fast-track review of imaging, lab records, and treatment roadmap with written clinical summary.",
      category: "Diagnostics Review",
      price: 80.0,
      currency: "USD",
      durationMinutes: 30,
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&h=400&q=80",
      tags: ["Second Opinion", "Lab Triage", "Diagnostics"],
      isActive: true,
    },
  });

  // 6. Seed Booking Order
  const existingOrder = await prisma.bookingOrder.findFirst({
    where: { consumerId: consumerUser.id },
  });

  if (!existingOrder) {
    const booking = await prisma.bookingOrder.create({
      data: {
        orderNumber: "ORD-2026-0001",
        serviceId: service1.id,
        providerId: providerUser.id,
        consumerId: consumerUser.id,
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        scheduledAt: new Date(Date.now() - 86400000 * 2),
        durationMin: 45,
        amount: 120.0,
        platformFee: 18.0, // 15% platform cut
        providerEarning: 102.0, // 85% provider cut
        currency: "USD",
        notes: "Routine follow-up regarding lab test results and lifestyle plan.",
        meetUrl: "https://meet.masterflow.io/room-sarah-alex-001",
        invoiceUrl: "/invoices/ORD-2026-0001.pdf",
      },
    });

    // 7. Seed Review for Booking
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        providerId: providerUser.id,
        consumerId: consumerUser.id,
        rating: 5,
        comment: "Dr. Sarah was exceptionally thorough, attentive, and provided actionable guidance right away. Highly recommended!",
        reply: "Thank you Alex, wishing you continuous good health!",
      },
    });

    // 8. Seed Payment Transaction
    await prisma.paymentTransaction.create({
      data: {
        invoiceNumber: "INV-2026-9001",
        gateway: "STRIPE",
        planId: service1.id,
        baseAmount: 120.0,
        discount: 0,
        taxAmount: 6.0,
        finalAmount: 126.0,
        currency: "USD",
        creditsAdded: 0,
        externalTrxId: "ch_3Pz7Q8LkjD891",
        status: PaymentStatus.PAID,
        userId: consumerUser.id,
      },
    });
  }

  // 9. Seed Active Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      code: "WELCOME50",
      discountPercent: 50,
      maxUses: 500,
      usedCount: 14,
      isActive: true,
      expiresAt: new Date(Date.now() + 86400000 * 90),
    },
  });

  // 10. Seed Welcome Notification
  const existingNotification = await prisma.notification.findFirst({
    where: { userId: consumerUser.id },
  });
  if (!existingNotification) {
    await prisma.notification.create({
      data: {
        userId: consumerUser.id,
        title: "Welcome Bonus Unlocked! 🎉",
        message: "You have received 35 complimentary credits to test our automated appointment scheduling and AI health triage assistant.",
        link: "/consumer",
      },
    });
  }

  console.log("✨ Master database seeding completed with realistic multi-portal data!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
