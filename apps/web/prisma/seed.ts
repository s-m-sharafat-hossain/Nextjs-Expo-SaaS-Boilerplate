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
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Starting Master SaaS Database Seeding...");

  // 0. Seed Platform Settings (Super Admin Governance)
  let platformSettings = await prisma.platformSettings.findFirst();
  if (!platformSettings) {
    platformSettings = await prisma.platformSettings.create({
      data: {
        platformName: "MasterFlow SaaS",
        maintenanceMode: false,
        maintenanceMessage: "We are undergoing scheduled platform maintenance. Please check back shortly.",
        registrationEnabled: true,
        defaultPlan: PlanType.FREE,
        maxFreeCredits: 25,
        platformFeePercent: 5.0,
        minPayoutAmount: 50.0,
        kycRequired: false,
        termsRequired: true,
      },
    });
    console.log("  ✅ PlatformSettings initialized with recommended governance defaults");
  }

  // 1. Seed SUPER_ADMIN User (Apex Privilege)
  const superAdminPasswordHash = await bcrypt.hash("SuperAdmin123!", 10);
  const superAdminUser = await prisma.user.upsert({
    where: { email: "superadmin@masterflow.io" },
    update: {
      role: Role.SUPER_ADMIN,
      plan: PlanType.AGENCY,
      credits: 999999,
      passwordHash: superAdminPasswordHash,
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
    },
    create: {
      email: "superadmin@masterflow.io",
      name: "Super Administrator",
      role: Role.SUPER_ADMIN,
      plan: PlanType.AGENCY,
      credits: 999999,
      passwordHash: superAdminPasswordHash,
      referralCode: "REF-SUPER-ADMIN-APEX",
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });
  console.log("  👑 Seeded Apex SUPER_ADMIN: superadmin@masterflow.io (Password: SuperAdmin123!)");

  // 2. Seed Demo Workspaces
  const defaultWorkspace = await prisma.workspace.upsert({
    where: { slug: "master-demo-workspace" },
    update: {
      superAdminId: superAdminUser.id,
    },
    create: {
      name: "Apex Global Health & Services",
      slug: "master-demo-workspace",
      superAdminId: superAdminUser.id,
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
    },
  });

  // 3. Seed Regular Admin User
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
    },
    create: {
      email: "admin@demo.com",
      name: "Operations Administrator",
      role: Role.ADMIN,
      plan: PlanType.AGENCY,
      credits: 9999,
      passwordHash: adminPasswordHash,
      referralCode: "REF-ADMIN-APEX",
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });
  console.log("  🛡️ Seeded Operations Admin: admin@demo.com (Password: Admin123!)");

  // 4. Seed Provider (Doctor / Vendor) User
  const providerPasswordHash = await bcrypt.hash("Provider123!", 10);
  const providerUser = await prisma.user.upsert({
    where: { email: "provider@demo.com" },
    update: {
      role: Role.PROVIDER,
      passwordHash: providerPasswordHash,
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
    },
    create: {
      email: "provider@demo.com",
      name: "Dr. Sarah Mitchell, MD",
      role: Role.PROVIDER,
      plan: PlanType.PRO,
      credits: 500,
      passwordHash: providerPasswordHash,
      referralCode: "REF-DR-SARAH",
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
      bio: "Board-certified Specialist with 12+ years experience in Tele-consultation & Digital Healthcare.",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1594824813627-4a64e9a039d9?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });
  console.log("  🩺 Seeded Provider: provider@demo.com (Password: Provider123!)");

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

  // 5. Seed Consumer (Patient / Customer) User
  const consumerPasswordHash = await bcrypt.hash("User123!", 10);
  const consumerUser = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {
      role: Role.CONSUMER,
      passwordHash: consumerPasswordHash,
      isActive: true,
      isBanned: false,
    },
    create: {
      email: "user@demo.com",
      name: "Alex Morgan",
      role: Role.CONSUMER,
      plan: PlanType.STARTER,
      credits: 35,
      passwordHash: consumerPasswordHash,
      referralCode: "REF-ALEX-M",
      kycStatus: KycStatus.VERIFIED,
      isActive: true,
      isBanned: false,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    },
  });
  console.log("  👤 Seeded Consumer: user@demo.com (Password: User123!)");

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

  // ==============================================================================
  // 11. CMS DATA SEEDING
  // ==============================================================================
  console.log("\n📦 Seeding CMS Content (FAQs, Blog Posts, Help Articles)...");

  // 1. FAQ Items (5 categories: General, Account, Billing, Payments, Technical)
  const faqItems = [
    {
      question: "What is MasterFlow and how does it work?",
      answer: "MasterFlow is an enterprise SaaS and multi-vendor marketplace platform featuring dedicated portals for Super Admins, Service Providers, and End Consumers with automated workflows and AI triaging.",
      category: "General",
      order: 1,
      isPublished: true,
    },
    {
      question: "How do I secure my account with Two-Factor Authentication (2FA)?",
      answer: "Navigate to your user settings from your profile avatar. Enable TOTP 2FA to scan a QR code with Google Authenticator or enroll WebAuthn biometric security keys.",
      category: "Account",
      order: 2,
      isPublished: true,
    },
    {
      question: "How does subscription billing and usage metering work?",
      answer: "We support both tiered monthly subscriptions and metered usage billing for API calls, AI tokens, and storage with real-time Stripe sync and proration.",
      category: "Billing",
      order: 3,
      isPublished: true,
    },
    {
      question: "Which payment methods and currencies are accepted?",
      answer: "We accept credit/debit cards via Stripe, PayPal, local bank transfers, and regional gateways across 10 global currencies with automatic VAT/tax calculation.",
      category: "Payments",
      order: 4,
      isPublished: true,
    },
    {
      question: "How do I configure custom webhooks and Zapier automation?",
      answer: "Go to Provider Dashboard > Integrations > Webhooks to register your HTTPS endpoints. Every outgoing event payload is cryptographically signed with HMAC SHA-256.",
      category: "Technical",
      order: 5,
      isPublished: true,
    },
  ];

  for (const faq of faqItems) {
    try {
      const existing = await prisma.faqItem.findFirst({
        where: { question: faq.question },
      });
      if (!existing) {
        await prisma.faqItem.create({ data: faq });
        console.log(`  ✓ Created FAQ [${faq.category}]: "${faq.question.slice(0, 40)}..."`);
      } else {
        await prisma.faqItem.update({
          where: { id: existing.id },
          data: faq,
        });
        console.log(`  ↻ Updated FAQ [${faq.category}]: "${faq.question.slice(0, 40)}..."`);
      }
    } catch (err: any) {
      console.warn(`  ⚠️ Failed to seed FAQ [${faq.category}]:`, err.message);
    }
  }

  // 2. Blog Posts (3 posts matching user specification)
  const blogPosts = [
    {
      slug: "getting-started-with-masterflow",
      title: "Getting Started with MasterFlow",
      summary: "A general introduction to MasterFlow's architecture, modular MVC features, and multi-tenant portal capabilities.",
      content: `Welcome to MasterFlow!

MasterFlow is a modern, enterprise-ready SaaS and multi-vendor marketplace platform built on Next.js 16, Prisma 6, and Tailwind CSS.

### What Makes MasterFlow Different?
- **Feature-Based Extended MVC**: Every feature domain contains its own schema, repository, service, controller, and UI components.
- **Enterprise Defense-in-Depth**: Rate limiting via Upstash Redis, double-submit cookie CSRF tokens, AES-256 field encryption, and TOTP 2FA.
- **Multi-Tenant White-Labeling**: Connect custom domains with automated SSL and custom organization branding.
- **Real-Time Presence & WebSockets**: Socket.io channels and Server-Sent Events (SSE) for instant collaboration.

Start by exploring your workspace dashboard or checking out our developer documentation.`,
      authorId: adminUser.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
      category: "General",
      tags: ["MasterFlow", "Getting Started", "SaaS", "Introduction"],
      readTimeMinutes: 5,
      viewCount: 1850,
    },
    {
      slug: "how-to-use-the-provider-portal",
      title: "How to Use the Provider Portal",
      summary: "A step-by-step operational guide for vendors, doctors, and partners to configure services, schedule availability, and track payouts.",
      content: `The Provider Portal is your centralized mission control for managing marketplace services, client bookings, and revenue.

### 1. Complete KYC Verification
Submit your identity documentation or professional certifications through the KYC tab for fast administrator approval.

### 2. Configure Service Listings & Availability
Define your hourly rates, consultation formats, and weekly availability slots.

### 3. Track Tasks on the Kanban Board
Organize client fulfillment across customizable workflow columns: To Do, In Progress, In Review, and Completed.

### 4. Monitor Payouts & Escrow
Request wallet withdrawals directly to your verified bank account once fulfillment is confirmed.`,
      authorId: providerUser.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      category: "Guides",
      tags: ["Provider", "Tutorial", "Bookings", "Kanban", "Payouts"],
      readTimeMinutes: 7,
      viewCount: 1240,
    },
    {
      slug: "payment-methods-explained",
      title: "Payment Methods Explained",
      summary: "A comprehensive billing guide explaining Stripe checkout, metered usage calculations, alternative payment gateways, and tax rules.",
      content: `MasterFlow provides an omnichannel billing and checkout architecture designed for global scalability.

### Supported Gateways
- **Stripe**: Credit/debit cards, Apple Pay, Google Pay, and SEPA direct debit with automated Stripe Tax calculations.
- **PayPal**: International wallet payments.
- **Regional & Mobile Gateways**: SSLCommerz, bKash, and manual wire deposits with transaction verification.

### Metered Usage & Proration
Subscriptions automatically calculate prorated credits and charges when upgrading or downgrading between Free, Starter, Pro, and Agency tiers. Every billing cycle generates an itemized, downloadable PDF receipt.`,
      authorId: adminUser.id,
      isPublished: true,
      publishedAt: new Date(),
      category: "Billing",
      tags: ["Billing", "Payments", "Stripe", "Invoices", "Taxes"],
      readTimeMinutes: 6,
      viewCount: 960,
    },
  ];

  for (const post of blogPosts) {
    try {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      });
      console.log(`  ✓ Created/Updated Blog Post: "${post.title}" (${post.category})`);
    } catch (err: any) {
      console.warn(`  ⚠️ Failed to seed Blog Post "${post.title}":`, err.message);
    }
  }

  // 3. Help Articles (5 categories: Getting Started, Account, Billing, Support, Technical)
  const helpArticles = [
    {
      slug: "workspace-quickstart-guide",
      title: "Workspace Quickstart: Initial Setup & Team Invitations",
      category: "Getting Started",
      content: "Learn how to establish your initial workspace, configure member roles (Owner, Admin, Member, Viewer), and invite team members to collaborate.",
      helpfulYes: 0,
      helpfulNo: 0,
      isPublished: true,
    },
    {
      slug: "securing-your-account-with-2fa",
      title: "Securing Your Account: Two-Factor Authentication & Biometrics",
      category: "Account",
      content: "Step-by-step instructions for enabling TOTP two-factor authentication, enrolling FIDO2/WebAuthn biometrics, and storing emergency backup recovery codes.",
      helpfulYes: 0,
      helpfulNo: 0,
      isPublished: true,
    },
    {
      slug: "understanding-billing-and-invoices",
      title: "Understanding Subscriptions, Invoices & Metered Usage",
      category: "Billing",
      content: "A guide to understanding subscription renewals, metered usage charges (API calls, AI tokens, compute seconds), downloading PDF receipts, and tax calculations.",
      helpfulYes: 0,
      helpfulNo: 0,
      isPublished: true,
    },
    {
      slug: "contacting-support-and-disputes",
      title: "Contacting Support, Ticket SLA & Dispute Mediation",
      category: "Support",
      content: "How to open high-priority customer support tickets, submit booking dispute refund requests, and work with our mediation team for resolution.",
      helpfulYes: 0,
      helpfulNo: 0,
      isPublished: true,
    },
    {
      slug: "developer-api-keys-and-webhooks",
      title: "Developer API Keys, Webhook Dispatcher & Rate Limits",
      category: "Technical",
      content: "Technical documentation for generating scoped API keys, registering HMAC SHA-256 signed webhook endpoints for Zapier/Make automations, and adhering to Redis rate limits.",
      helpfulYes: 0,
      helpfulNo: 0,
      isPublished: true,
    },
  ];

  for (const article of helpArticles) {
    try {
      await prisma.helpArticle.upsert({
        where: { slug: article.slug },
        update: article,
        create: article,
      });
      console.log(`  ✓ Created/Updated Help Article [${article.category}]: "${article.title}"`);
    } catch (err: any) {
      console.warn(`  ⚠️ Failed to seed Help Article "${article.title}":`, err.message);
    }
  }

  console.log("\n✨ Master database seeding completed with realistic multi-portal data and CMS!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
