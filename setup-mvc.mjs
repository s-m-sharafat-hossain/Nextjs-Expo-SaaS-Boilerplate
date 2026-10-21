// setup-mvc.mjs
// ব্যবহার: node setup-mvc.mjs
//
// এই script পুরো monorepo-র Feature-Based Modular MVC directory structure তৈরি করে।
// পুরনো src/modules/ pattern ব্যবহার করা হয় না।
// সব feature apps/web/src/features/ এর ভেতরে থাকে।

import fs from 'fs';
import path from 'path';

const dirs = [
  // ── Web App Core Directories ───────────────────────────────────────────────
  'apps/web/src/features/auth',
  'apps/web/src/features/billing',
  'apps/web/src/features/credits',
  'apps/web/src/features/workspaces',
  'apps/web/src/features/ai-engine',
  'apps/web/src/features/chat-n8n',
  'apps/web/src/features/media',
  'apps/web/src/features/reviews-disputes',
  'apps/web/src/features/notifications-feedback',

  // ── Portal Feature Directories ─────────────────────────────────────────────
  'apps/web/src/features/portals/admin-portal',
  'apps/web/src/features/portals/provider-portal',
  'apps/web/src/features/portals/consumer-portal',

  // ── Shared Utilities & Config ──────────────────────────────────────────────
  'apps/web/src/shared/config',
  'apps/web/src/shared/lib',
  'apps/web/src/shared/middlewares',
  'apps/web/src/shared/utils',
  'apps/web/src/shared/hooks',
  'apps/web/src/shared/layouts',
  'apps/web/src/shared/components',

  // ── API Routes (v1) ────────────────────────────────────────────────────────
  'apps/web/src/app/api/v1/auth/demo',
  'apps/web/src/app/api/v1/billing/checkout',
  'apps/web/src/app/api/v1/ai',
  'apps/web/src/app/api/v1/tickets',
  'apps/web/src/app/api/v1/bookings',

  // ── App Pages ──────────────────────────────────────────────────────────────
  'apps/web/src/app/(auth)/login',
  'apps/web/src/app/(dashboard)/dashboard',
  'apps/web/src/app/(dashboard)/admin',
  'apps/web/src/app/(dashboard)/provider',
  'apps/web/src/app/(dashboard)/consumer',

  // ── Shared Packages ────────────────────────────────────────────────────────
  'packages/shared/config',
  'packages/shared/types',

  // ── Mobile App ─────────────────────────────────────────────────────────────
  'apps/mobile/src',

  // ── Scripts & Tooling ──────────────────────────────────────────────────────
  'scripts',
  '.antigravity',
];

dirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`✅ Created: ${dir}`);
});

console.log('\n🚀 Monorepo Feature-Based MVC directory structure created successfully!');
console.log('\n📌 Next Steps:');
console.log('   1. Generate a new feature:  node scripts/make-mvc.mjs <feature-name>');
console.log('   2. Central config:          packages/shared/config/master.config.ts');
console.log('   3. API routes live in:      apps/web/src/app/api/v1/');
console.log('   4. Features live in:        apps/web/src/features/<feature-name>/');
