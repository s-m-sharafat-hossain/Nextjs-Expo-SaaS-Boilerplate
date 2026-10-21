import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Briefcase,
  Calendar,
  Clock,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Video,
  FileText,
  DollarSign,
  Plus,
  ShieldCheck,
  UploadCloud,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useProviderPortalController, ProviderPortalTab } from "./provider.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

export const ProviderPortalScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    activeTab,
    setActiveTab,
    listings,
    bookings,
    slots,
    isQrScannerOpen,
    setIsQrScannerOpen,
    qrTokenInput,
    setQrTokenInput,
    kycDocType,
    setKycDocType,
    kycDocNumber,
    setKycDocNumber,
    kycSubmitted,
    isLoading,
    actionLoadingId,
    error,
    successMessage,
    loadData,
    handleToggleListing,
    handleUpdateBookingStatus,
    handleToggleSlot,
    handleVerifyQr,
    handleUploadKyc,
  } = useProviderPortalController();

  return (
    <StandardMobileScreenShell
      title="Provider Hub"
      subtitle="Orders Queue, Services & Schedule Manager"
      isLoading={isLoading}
      onRefresh={loadData}
      headerRightSlot={
        <TouchableOpacity
          style={[styles.qrScanBtn, { backgroundColor: `${themeConfig.colors.primary[500]}20` }]}
          onPress={() => setIsQrScannerOpen(true)}
        >
          <QrCode size={18} color={themeConfig.colors.primary[500]} />
        </TouchableOpacity>
      }
    >
      {/* Success Notification */}
      {successMessage && (
        <View style={styles.successBanner}>
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {/* Error Notification */}
      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={16} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Tab Navigation Ribbon */}
      <View style={[styles.tabSelector, { backgroundColor: colors.cardSubtle }]}>
        {(
          [
            { id: "QUEUE", label: `Queue (${bookings.length})` },
            { id: "SERVICES", label: `Services (${listings.length})` },
            { id: "SCHEDULE", label: "Slots" },
            { id: "KYC", label: "KYC Badge" },
          ] as { id: ProviderPortalTab; label: string }[]
        ).map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.tabBtn,
                isSelected && [styles.tabBtnActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setActiveTab(t.id)}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: isSelected ? colors.textPrimary : colors.textSecondary },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab 1: Bookings Queue */}
      {activeTab === "QUEUE" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Today's Incoming Appointments & Orders
          </Text>

          {bookings.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No pending bookings in your queue today.
              </Text>
            </View>
          ) : (
            bookings.map((b) => (
              <View
                key={b.id}
                style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.bookingTopRow}>
                  <View>
                    <Text style={[styles.clientName, { color: colors.textPrimary }]}>
                      {b.consumerName}
                    </Text>
                    <Text style={[styles.serviceTitle, { color: themeConfig.colors.primary[500] }]}>
                      {b.serviceTitle}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          b.status === "CONFIRMED"
                            ? "rgba(16, 185, 129, 0.15)"
                            : b.status === "COMPLETED"
                            ? "rgba(14, 165, 233, 0.15)"
                            : "rgba(245, 158, 11, 0.15)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color:
                            b.status === "CONFIRMED"
                              ? "#10b981"
                              : b.status === "COMPLETED"
                              ? "#0ea5e9"
                              : "#f59e0b",
                        },
                      ]}
                    >
                      {b.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingMetaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                      {b.scheduledDate} at {b.scheduledTime}
                    </Text>
                  </View>
                  <Text style={[styles.amountText, { color: colors.textPrimary }]}>
                    ${b.amount.toFixed(2)}
                  </Text>
                </View>

                {/* Queue Actions */}
                <View style={styles.queueActionsRow}>
                  {b.status === "PENDING" && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.declineBtn]}
                        onPress={() => handleUpdateBookingStatus(b.id, "CANCELLED")}
                        disabled={actionLoadingId === b.id}
                      >
                        <Text style={styles.declineText}>Decline</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                        onPress={() => handleUpdateBookingStatus(b.id, "CONFIRMED")}
                        disabled={actionLoadingId === b.id}
                      >
                        <Text style={styles.acceptText}>Accept Booking</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {b.status === "CONFIRMED" && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#10b981", flex: 1 }]}
                      onPress={() => handleUpdateBookingStatus(b.id, "COMPLETED")}
                      disabled={actionLoadingId === b.id}
                    >
                      <Check size={16} color="#ffffff" />
                      <Text style={styles.acceptText}>Mark Consultation Complete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Tab 2: Service / Listing Manager */}
      {activeTab === "SERVICES" && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              Active Services & Catalog
            </Text>
          </View>

          {listings.map((item) => (
            <View
              key={item.id}
              style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.serviceHeaderRow}>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.serviceCategory, { color: colors.textSecondary }]}>
                    {item.category} • {item.durationMinutes} mins
                  </Text>
                </View>
                <Switch
                  value={item.active}
                  onValueChange={() => handleToggleListing(item.id, item.active)}
                  trackColor={{ false: colors.border, true: themeConfig.colors.primary[500] }}
                />
              </View>

              <Text style={[styles.serviceDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.serviceFooterRow}>
                <Text style={[styles.servicePrice, { color: themeConfig.colors.primary[500] }]}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={[styles.serviceBookingsCount, { color: colors.textMuted }]}>
                  {item.bookingsCount} Completed Bookings
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tab 3: Availability Slots */}
      {activeTab === "SCHEDULE" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Weekly Working Hours & Availability
          </Text>

          {slots.map((slot) => (
            <View
              key={slot.id}
              style={[styles.slotRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View>
                <Text style={[styles.slotDay, { color: colors.textPrimary }]}>
                  {slot.dayOfWeek}
                </Text>
                <Text style={[styles.slotHours, { color: colors.textSecondary }]}>
                  {slot.isActive ? `${slot.startTime} - ${slot.endTime}` : "Unavailable / Closed"}
                </Text>
              </View>

              <Switch
                value={slot.isActive}
                onValueChange={() => handleToggleSlot(slot.id, slot.isActive)}
                trackColor={{ false: colors.border, true: themeConfig.colors.primary[500] }}
              />
            </View>
          ))}
        </View>
      )}

      {/* Tab 4: KYC Upload */}
      {activeTab === "KYC" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Identity & Professional Credentials Verification
          </Text>

          {kycSubmitted ? (
            <View style={[styles.kycSuccessCard, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
              <ShieldCheck size={36} color="#10b981" />
              <Text style={styles.kycSuccessTitle}>Verification In Review</Text>
              <Text style={[styles.kycSuccessDesc, { color: colors.textSecondary }]}>
                Your documents have been encrypted and submitted to the Super Admin portal for approval.
              </Text>
            </View>
          ) : (
            <View style={[styles.kycFormCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.kycFormDesc, { color: colors.textSecondary }]}>
                Upload government ID, medical license, or business registration to receive your verified partner badge and activate instant payouts.
              </Text>

              <View style={styles.kycInputGroup}>
                <Text style={[styles.kycLabel, { color: colors.textSecondary }]}>License / ID Number</Text>
                <TextInput
                  style={[styles.kycInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="e.g. MD-9821038"
                  placeholderTextColor={colors.textMuted}
                  value={kycDocNumber}
                  onChangeText={setKycDocNumber}
                />
              </View>

              <TouchableOpacity
                style={[styles.kycUploadBox, { borderColor: themeConfig.colors.primary[500], backgroundColor: `${themeConfig.colors.primary[500]}10` }]}
                onPress={handleUploadKyc}
              >
                <UploadCloud size={28} color={themeConfig.colors.primary[500]} />
                <Text style={[styles.kycUploadText, { color: themeConfig.colors.primary[500] }]}>
                  Tap to Capture or Pick Document Scan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.kycSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                onPress={handleUploadKyc}
              >
                <Text style={styles.kycSubmitBtnText}>Submit KYC for Approval</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* QR Ticket Verification Modal */}
      <Modal
        visible={isQrScannerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsQrScannerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Scan / Enter QR Ticket Token
              </Text>
              <TouchableOpacity onPress={() => setIsQrScannerOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Verify client's appointment ticket QR code or enter ticket code:
            </Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="QR_BKG_9021_TOKEN"
              placeholderTextColor={colors.textMuted}
              value={qrTokenInput}
              onChangeText={setQrTokenInput}
            />

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={() => handleVerifyQr(qrTokenInput || "QR_BKG_9021_TOKEN")}
            >
              <Text style={styles.modalSubmitText}>Verify & Check-In Client</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </StandardMobileScreenShell>
  );
};

const styles = StyleSheet.create({
  qrScanBtn: {
    padding: 8,
    borderRadius: 10,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "600",
  },
  tabSelector: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabBtnActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
  },
  bookingCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  bookingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  clientName: {
    fontSize: 15,
    fontWeight: "700",
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bookingMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
  },
  queueActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    gap: 6,
  },
  declineBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  declineText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "700",
  },
  acceptText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  serviceCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  serviceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceCategory: {
    fontSize: 11,
    marginTop: 2,
  },
  serviceDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  serviceFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  serviceBookingsCount: {
    fontSize: 11,
  },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  slotDay: {
    fontSize: 14,
    fontWeight: "700",
  },
  slotHours: {
    fontSize: 12,
    marginTop: 2,
  },
  kycSuccessCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },
  kycSuccessTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  kycSuccessDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  kycFormCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  kycFormDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  kycInputGroup: {
    marginBottom: 14,
  },
  kycLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  kycInput: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  kycUploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  kycUploadText: {
    fontSize: 13,
    fontWeight: "600",
  },
  kycSubmitBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  kycSubmitBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 16,
  },
  modalSubmitBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
