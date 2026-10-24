// apps/web/src/features/branding/branding.service.ts
import { prisma } from "@/shared/lib/prisma";

export interface CustomBrandingConfig {
  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  supportEmail?: string;
  customCss?: string;
}

export class BrandingService {
  /**
   * Get branding for a workspace
   */
  static async getBranding(workspaceId: string): Promise<CustomBrandingConfig | null> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { customBranding: true, logoUrl: true, name: true },
    });

    if (!workspace) return null;

    const baseBranding: CustomBrandingConfig = {
      companyName: workspace.name,
      logoUrl: workspace.logoUrl || undefined,
      primaryColor: "#4f46e5",
      accentColor: "#ec4899",
    };

    if (workspace.customBranding && typeof workspace.customBranding === "object") {
      return { ...baseBranding, ...(workspace.customBranding as Record<string, any>) };
    }

    return baseBranding;
  }

  /**
   * Update branding configuration for a workspace
   */
  static async updateBranding(workspaceId: string, branding: CustomBrandingConfig) {
    return prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(branding.logoUrl && { logoUrl: branding.logoUrl }),
        ...(branding.companyName && { name: branding.companyName }),
        customBranding: branding as any,
      },
    });
  }
}
