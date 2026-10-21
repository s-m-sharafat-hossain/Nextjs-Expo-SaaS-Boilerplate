// apps/mobile/src/app/(tabs)/bookings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  Calendar,
  Video,
  CheckCircle,
  Clock,
  FileText,
  QrCode,
  AlertTriangle,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

interface BookingItem {
  id: string;
  orderNumber: string;
  serviceTitle: string;
  specialistName: string;
  scheduledAt: string;
  amount: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetUrl?: string;
}

const DEMO_BOOKINGS: BookingItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2026-0001",
    serviceTitle: "Comprehensive Health & Specialist Review",
    specialistName: "Dr. Sarah Mitchell, MD",
    scheduledAt: "Tomorrow, 10:00 AM",
    amount: 120,
    status: "CONFIRMED",
    meetUrl: "https://meet.masterflow.io/room-sarah-alex-001",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2026-0002",
    serviceTitle: "Rapid Clinical Second Opinion",
    specialistName: "Dr. Sarah Mitchell, MD",
    scheduledAt: "Oct 18, 2:30 PM",
    amount: 80,
    status: "COMPLETED",
  },
];

export default function BookingsScreen() {
  const { activeRole } = useAuthStore();
  const { colors } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  return (
    <StandardMobileScreenShell
      title={activeRole === "PROVIDER" ? "Incoming Orders Queue" : "My Bookings & Orders"}
      subtitle={
        activeRole === "PROVIDER"
          ? "Client sessions & consultation fulfillment"
          : "Track live status and join video consultations"
      }
      showSearchButton
    >
      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {["ALL", "CONFIRMED", "COMPLETED"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterTab,
              {
                borderColor:
                  selectedFilter === filter
                    ? themeConfig.colors.primary[500]
                    : colors.border,
                backgroundColor:
                  selectedFilter === filter
                    ? `${themeConfig.colors.primary[500]}15`
                    : colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                {
                  color:
                    selectedFilter === filter
                      ? themeConfig.colors.primary[500]
                      : colors.textSecondary,
                  fontWeight: selectedFilter === filter ? "700" : "500",
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings Queue */}
      <View style={styles.list}>
        {DEMO_BOOKINGS.map((order) => {
          const isConfirmed = order.status === "CONFIRMED";

          return (
            <View
              key={order.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Header with Order # and Status */}
              <View style={styles.cardHeader}>
                <View style={styles.orderNumberRow}>
                  <QrCode size={14} color={themeConfig.colors.primary[400]} />
                  <Text
                    style={[styles.orderNumberText, { color: colors.textPrimary }]}
                  >
                    {order.orderNumber}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isConfirmed
                        ? themeConfig.colors.status.warningLight
                        : themeConfig.colors.status.successLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color: isConfirmed
                          ? themeConfig.colors.status.warning
                          : themeConfig.colors.status.success,
                      },
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Title & Specialist */}
              <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                {order.serviceTitle}
              </Text>
              <Text
                style={[styles.specialistText, { color: colors.textSecondary }]}
              >
                Specialist: {order.specialistName}
              </Text>

              {/* Scheduled Time & Price */}
              <View style={styles.metaRow}>
                <View style={styles.timeTag}>
                  <Clock size={13} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {order.scheduledAt}
                  </Text>
                </View>

                <Text style={[styles.amountText, { color: colors.textPrimary }]}>
                  ${order.amount}.00
                </Text>
              </View>

              {/* Actions */}
              <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                {order.meetUrl && isConfirmed ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(order.meetUrl!)}
                    style={[
                      styles.meetBtn,
                      { backgroundColor: themeConfig.colors.primary[500] },
                    ]}
                  >
                    <Video size={16} color="#ffffff" />
                    <Text style={styles.meetBtnText}>Join Video Consultation</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.invoiceBtn,
                      { borderColor: colors.border, backgroundColor: colors.surface },
                    ]}
                  >
                    <FileText size={14} color={colors.textSecondary} />
                    <Text
                      style={[styles.invoiceBtnText, { color: colors.textPrimary }]}
                    >
                      View Invoice Receipt
                    </Text>
                  </TouchableOpacity>
                )}

                {!isConfirmed && (
                  <TouchableOpacity
                    style={[
                      styles.reviewBtn,
                      {
                        backgroundColor: `${themeConfig.colors.status.success}20`,
                      },
                    ]}
                  >
                    <CheckCircle
                      size={14}
                      color={themeConfig.colors.status.success}
                    />
                    <Text
                      style={[
                        styles.reviewBtnText,
                        { color: themeConfig.colors.status.success },
                      ]}
                    >
                      5★ Reviewed
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </StandardMobileScreenShell>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 12,
  },
  list: {
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderNumberText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  specialistText: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  meetBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  meetBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  invoiceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  invoiceBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
