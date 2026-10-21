import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  ShieldAlert,
  TrendingUp,
  Users,
  DollarSign,
  FileCheck2,
  ArrowUpRight,
  Receipt,
  Scale,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useAdminPortalController, AdminPortalTab } from "./admin.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

export const AdminPortalScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    activeTab,
    setActiveTab,
    metrics,
    kycList,
    payoutList,
    manualTrxList,
    disputesList,
    isLoading,
    actionLoadingId,
    error,
    successMessage,
    loadData,
    handleReviewKyc,
    handleReviewPayout,
    handleReviewManualTrx,
    handleResolveDispute,
  } = useAdminPortalController();

  return (
    <StandardMobileScreenShell
      title="Admin Governance"
      subtitle="Super Admin Command Center & Approvals"
      isLoading={isLoading}
      onRefresh={loadData}
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

      {/* Primary KPI Summary Row */}
      {metrics && (
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: `${themeConfig.colors.primary[500]}15` }]}>
              <TrendingUp size={18} color={themeConfig.colors.primary[500]} />
            </View>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>MRR</Text>
            <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
              ${metrics.mrr.toLocaleString()}
            </Text>
            <Text style={[styles.kpiSub, { color: "#10b981" }]}>+18.4% this mo</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.kpiIconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Users size={18} color="#10b981" />
            </View>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Total Users</Text>
            <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
              {metrics.totalUsers.toLocaleString()}
            </Text>
            <Text style={[styles.kpiSub, { color: colors.textMuted }]}>
              {metrics.activeProviders} Providers
            </Text>
          </View>
        </View>
      )}

      {/* Tab Navigation Ribbon */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {(
          [
            { id: "OVERVIEW", label: "Overview", count: 0 },
            { id: "KYC", label: "KYC Queue", count: kycList.length },
            { id: "PAYOUTS", label: "Payouts", count: payoutList.length },
            { id: "MANUAL_TRX", label: "Bank Trx", count: manualTrxList.length },
            { id: "DISPUTES", label: "Disputes", count: disputesList.length },
          ] as { id: AdminPortalTab; label: string; count: number }[]
        ).map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isSelected ? themeConfig.colors.primary[500] : colors.card,
                  borderColor: isSelected ? themeConfig.colors.primary[500] : colors.border,
                },
              ]}
              onPress={() => setActiveTab(t.id)}
            >
              <Text
                style={[
                  styles.tabPillText,
                  { color: isSelected ? "#ffffff" : colors.textPrimary },
                ]}
              >
                {t.label}
              </Text>
              {t.count > 0 && (
                <View
                  style={[
                    styles.tabCountBadge,
                    { backgroundColor: isSelected ? "rgba(255,255,255,0.3)" : "#ef4444" },
                  ]}
                >
                  <Text style={styles.tabCountText}>{t.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tab 1: Overview */}
      {activeTab === "OVERVIEW" && metrics && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Platform Governance Snapshot
          </Text>

          <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Gross Marketplace Volume</Text>
              <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>${metrics.grossRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Net Platform Commission</Text>
              <Text style={[styles.summaryVal, { color: "#10b981" }]}>+${metrics.platformCommission.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Active Providers</Text>
              <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>{metrics.activeProviders}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>ARR Projected</Text>
              <Text style={[styles.summaryVal, { color: colors.textPrimary }]}>${metrics.arr.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tab 2: KYC Approvals */}
      {activeTab === "KYC" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Provider KYC Verification Queue ({kycList.length})
          </Text>

          {kycList.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>All provider KYC submissions have been verified!</Text>
            </View>
          ) : (
            kycList.map((item) => (
              <View key={item.id} style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.actionCardHeader}>
                  <View>
                    <Text style={[styles.providerName, { color: colors.textPrimary }]}>{item.providerName}</Text>
                    <Text style={[styles.providerSpecialty, { color: themeConfig.colors.primary[500] }]}>{item.specialtyOrBusiness}</Text>
                  </View>
                  <View style={[styles.docTypeBadge, { backgroundColor: colors.cardSubtle }]}>
                    <Text style={[styles.docTypeText, { color: colors.textSecondary }]}>{item.documentType}</Text>
                  </View>
                </View>

                <Image source={{ uri: item.documentUrl }} style={styles.docPreview} />

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}
                    onPress={() => handleReviewKyc(item.id, "REJECTED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <X size={16} color="#ef4444" />
                    <Text style={[styles.rejectBtnText, { color: "#ef4444" }]}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                    onPress={() => handleReviewKyc(item.id, "VERIFIED")}
                    disabled={actionLoadingId === item.id}
                  >
                    {actionLoadingId === item.id ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="#ffffff" />
                        <Text style={styles.approveBtnText}>1-Tap Approve KYC</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Tab 3: Payout Approvals */}
      {activeTab === "PAYOUTS" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Pending Payout Requests ({payoutList.length})
          </Text>

          {payoutList.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No pending payouts requiring approval.</Text>
            </View>
          ) : (
            payoutList.map((item) => (
              <View key={item.id} style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.actionCardHeader}>
                  <View>
                    <Text style={[styles.providerName, { color: colors.textPrimary }]}>{item.providerName}</Text>
                    <Text style={[styles.payoutAmount, { color: "#10b981" }]}>${item.amount.toFixed(2)} USD</Text>
                  </View>
                  <Text style={[styles.payoutMethod, { color: colors.textMuted }]}>{item.method}</Text>
                </View>

                <Text style={[styles.payoutAccount, { color: colors.textSecondary }]}>
                  Destination: {item.accountDetails}
                </Text>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}
                    onPress={() => handleReviewPayout(item.id, "REJECTED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <X size={16} color="#ef4444" />
                    <Text style={[styles.rejectBtnText, { color: "#ef4444" }]}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, { backgroundColor: "#10b981" }]}
                    onPress={() => handleReviewPayout(item.id, "APPROVED")}
                    disabled={actionLoadingId === item.id}
                  >
                    {actionLoadingId === item.id ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <>
                        <Check size={16} color="#ffffff" />
                        <Text style={styles.approveBtnText}>Authorize Transfer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Tab 4: Manual Bank Trx */}
      {activeTab === "MANUAL_TRX" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Manual TrxID Verifications ({manualTrxList.length})
          </Text>

          {manualTrxList.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No pending bank or mobile money transactions.</Text>
            </View>
          ) : (
            manualTrxList.map((item) => (
              <View key={item.id} style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.actionCardHeader}>
                  <View>
                    <Text style={[styles.providerName, { color: colors.textPrimary }]}>{item.userName}</Text>
                    <Text style={[styles.payoutAmount, { color: themeConfig.colors.primary[500] }]}>${item.amount} ({item.gateway})</Text>
                  </View>
                  <Text style={[styles.docTypeText, { color: colors.textMuted }]}>TrxID: {item.transactionId}</Text>
                </View>

                <Text style={[styles.payoutAccount, { color: colors.textSecondary }]}>
                  Sender: {item.senderAccount}
                </Text>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}
                    onPress={() => handleReviewManualTrx(item.id, "REJECTED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <X size={16} color="#ef4444" />
                    <Text style={[styles.rejectBtnText, { color: "#ef4444" }]}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                    onPress={() => handleReviewManualTrx(item.id, "APPROVED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <Check size={16} color="#ffffff" />
                    <Text style={styles.approveBtnText}>Activate Credits</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Tab 5: Disputes */}
      {activeTab === "DISPUTES" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Dispute Resolution Center ({disputesList.length})
          </Text>

          {disputesList.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Zero active consumer disputes.</Text>
            </View>
          ) : (
            disputesList.map((item) => (
              <View key={item.id} style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.actionCardHeader}>
                  <View>
                    <Text style={[styles.providerName, { color: colors.textPrimary }]}>{item.ticketNumber}</Text>
                    <Text style={[styles.providerSpecialty, { color: colors.textSecondary }]}>
                      {item.consumerName} vs. {item.providerName}
                    </Text>
                  </View>
                  <Text style={[styles.payoutAmount, { color: "#ef4444" }]}>${item.amount}</Text>
                </View>

                <Text style={[styles.disputeReason, { color: colors.textPrimary }]}>
                  "{item.reason}"
                </Text>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, { backgroundColor: colors.cardSubtle }]}
                    onPress={() => handleResolveDispute(item.id, "RESOLVED_DISMISSED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <Text style={[styles.rejectBtnText, { color: colors.textSecondary }]}>Dismiss Claim</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, { backgroundColor: "#ef4444" }]}
                    onPress={() => handleResolveDispute(item.id, "RESOLVED_REFUNDED")}
                    disabled={actionLoadingId === item.id}
                  >
                    <Text style={styles.approveBtnText}>Issue Full Refund</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </StandardMobileScreenShell>
  );
};

const styles = StyleSheet.create({
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
  kpiGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  tabScroll: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabCountText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: "700",
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
  actionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  providerName: {
    fontSize: 15,
    fontWeight: "700",
  },
  providerSpecialty: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  docTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  docTypeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  docPreview: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  payoutMethod: {
    fontSize: 12,
  },
  payoutAccount: {
    fontSize: 13,
    marginBottom: 12,
  },
  disputeReason: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 10,
    gap: 6,
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  approveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 10,
    gap: 6,
  },
  approveBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
