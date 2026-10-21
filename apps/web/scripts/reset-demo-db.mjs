// scripts/reset-demo-db.mjs
// Automated 24-Hour Reset Script for Portfolio & Freelance Demo Visitors
// Cleans up ephemeral visitor records and restores baseline Admin, Provider, and Consumer accounts.

import { execSync } from "child_process";

console.log("🧹 [DEMO DB RESET] Starting 24-Hour Portfolio Database Reset...");

try {
  console.log("⚡ [1/2] Re-seeding baseline database accounts & listings...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

  console.log("✅ [2/2] Demo database reset completed successfully!");
  console.log("   - Super Admin: admin@demo.com");
  console.log("   - Doctor/Provider: provider@demo.com");
  console.log("   - Patient/Consumer: user@demo.com");
} catch (err) {
  console.error("❌ [DEMO DB RESET] Failed to reset demo database:", err);
  process.exit(1);
}
