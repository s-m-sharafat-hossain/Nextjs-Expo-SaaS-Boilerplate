// apps/web/src/shared/domains/domain-service.ts
import dns from "dns/promises";
import { prisma } from "@/shared/lib/prisma";

export interface DomainVerificationResult {
  domain: string;
  isVerified: boolean;
  expectedCname: string;
  foundRecords: string[];
  sslStatus: "PENDING" | "ACTIVE" | "FAILED";
  error?: string;
}

export class DomainService {
  private static readonly EXPECTED_CNAME = process.env.NEXT_PUBLIC_CNAME_TARGET || "cname.saasflow.app";

  /**
   * Register a custom domain for a workspace
   */
  static async registerDomain(workspaceId: string, rawDomain: string) {
    const domain = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    // Check if domain is already in use
    const existing = await prisma.customDomain.findUnique({
      where: { domain },
    });

    if (existing && existing.workspaceId !== workspaceId) {
      throw new Error("Domain is already registered by another organization");
    }

    return prisma.customDomain.upsert({
      where: { workspaceId },
      update: {
        domain,
        status: "PENDING",
        sslStatus: "PENDING",
        dnsRecord: `CNAME -> ${this.EXPECTED_CNAME}`,
      },
      create: {
        workspaceId,
        domain,
        status: "PENDING",
        sslStatus: "PENDING",
        dnsRecord: `CNAME -> ${this.EXPECTED_CNAME}`,
      },
    });
  }

  /**
   * Verify DNS CNAME record for a domain
   */
  static async verifyDomain(domain: string): Promise<DomainVerificationResult> {
    const expectedCname = this.EXPECTED_CNAME;
    let foundRecords: string[] = [];
    let isVerified = false;

    try {
      // In local dev/test, mock verification if target is test domain
      if (domain.includes(".test") || domain.includes("localhost") || process.env.NODE_ENV === "development") {
        isVerified = true;
        foundRecords = [expectedCname];
      } else {
        foundRecords = await dns.resolveCname(domain);
        isVerified = foundRecords.some((record) =>
          record.toLowerCase().includes(expectedCname.toLowerCase())
        );
      }
    } catch (err: any) {
      // Fallback: check A records if apex
      try {
        const aRecords = await dns.resolve4(domain);
        foundRecords = aRecords;
      } catch {
        // Unresolved
      }
    }

    const sslStatus = isVerified ? "ACTIVE" : "PENDING";
    const status = isVerified ? "ACTIVE" : "PENDING";

    // Update in database if exists
    try {
      await prisma.customDomain.update({
        where: { domain },
        data: {
          status,
          sslStatus,
          verifiedAt: isVerified ? new Date() : null,
        },
      });
    } catch {
      // Not found in DB or skipped
    }

    return {
      domain,
      isVerified,
      expectedCname,
      foundRecords,
      sslStatus,
    };
  }

  /**
   * Find workspace by custom domain or subdomain
   */
  static async findWorkspaceByHost(host: string) {
    const cleanHost = host.split(":")[0].toLowerCase();

    // 1. Check custom domains table
    const custom = await prisma.customDomain.findUnique({
      where: { domain: cleanHost },
      include: { workspace: true },
    });

    if (custom && custom.status === "ACTIVE") {
      return custom.workspace;
    }

    // 2. Check workspace subdomains (e.g. acme.saasflow.app)
    const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost";
    if (cleanHost.endsWith(`.${baseDomain}`)) {
      const slug = cleanHost.replace(`.${baseDomain}`, "");
      return prisma.workspace.findUnique({
        where: { slug },
      });
    }

    return null;
  }
}
