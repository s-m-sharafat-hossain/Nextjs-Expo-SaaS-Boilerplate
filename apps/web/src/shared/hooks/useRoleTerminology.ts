// apps/web/src/shared/hooks/useRoleTerminology.ts
"use client";

import { useMemo } from "react";
import { siteConfig } from "@shared/config";

export type RoleType = "ADMIN" | "PROVIDER" | "CONSUMER";

export function useRoleTerminology(role?: RoleType | string) {
  return useMemo(() => {
    const roles = siteConfig.roleLabels;

    const providerLabel = roles.provider.singular;
    const providerPlural = roles.provider.plural;
    const consumerLabel = roles.consumer.singular;
    const consumerPlural = roles.consumer.plural;
    const adminLabel = roles.admin.singular;

    let currentRoleTitle = adminLabel;
    let currentPortalPath = roles.admin.portalPath;

    if (role === "PROVIDER") {
      currentRoleTitle = providerLabel;
      currentPortalPath = roles.provider.portalPath;
    } else if (role === "CONSUMER") {
      currentRoleTitle = consumerLabel;
      currentPortalPath = roles.consumer.portalPath;
    }

    return {
      adminLabel,
      providerLabel,
      providerPlural,
      providerUnitName: providerLabel,
      consumerLabel,
      consumerPlural,
      consumerUnitName: consumerLabel,
      currentRoleTitle,
      currentPortalPath,
      serviceUnitName: roles.provider.serviceUnitName,
      bookingUnitName: roles.consumer.bookingUnitName,
      earningsUnitName: roles.provider.earningsUnitName,
      providerBadge: roles.provider.badge,
    };
  }, [role]);
}
