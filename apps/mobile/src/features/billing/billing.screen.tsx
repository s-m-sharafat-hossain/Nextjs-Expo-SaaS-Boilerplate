import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  RefreshCw,
  X,
  Fingerprint,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useBillingController } from "./billing.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";
import { PaymentGatewayType, CreditPackage, Transaction } from "./billing.schema";

const GATEWAYS: { id: PaymentGatewayType; label: string; flag: string }[] = [
  { id: "STRIPE", label: "Stripe", flag: "💳" },
  { id: "PAYPAL", label: "PayPal", flag: "🌐" },
  { id: "SSLCOMMERZ", label: "SSLCommerz", flag: "🇧🇩" },
  { id: "BKASH", label: "bKash / Nagad", flag: "📱" },
  { id: "RAZORPAY", label: "Razorpay", flag: "🇮🇳" },
  { id: "PAYSTACK", label: "Paystack", flag: "🌍" },
  { id: "MANUAL_BANK", label: "Direct Bank", flag: "🏦" },
];

export const BillingScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    activeTab,
    setActiveTab,
    packages,
    transactions,
    selectedGateway,
    setSelectedGateway,
    selectedPackage,
    setSelectedPackage,
    isPayoutSheetOpen,
    setIsPayoutSheetOpen,
    payoutAmount,
    setPayoutAmount,
    payoutAccount,
    setPayoutAccount,
    payoutMethod,
    setPayoutMethod,
    isManualTrxModalOpen,
    setIsManualTrxModalOpen,
    manualTrxId,
    setManualTrxId,
    manualSender,
    setManualSender,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    user,
    activeRole,
    loadData,
    handlePurchasePackage,
    handleRequestPayout,
    handleSubmitManualTrx,
  } = useBillingController();

  const isProvider = activeRole === "PROVIDER" || activeRole === "ADMIN";

  return (
    <StandardMobileScreenShell
      title="Wallet & Payments"
      subtitle={isProvider ? "Earnings, Payouts & Commission" : "Credits, Gateways & Invoices"}
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

      {/* Luxury Wallet Card */}
      <View
        style={[
          styles.walletCard,
          { backgroundColor: themeConfig.colors.primary[500] },
        ]}
      >
        <View style={styles.walletHeaderRow}>
          <View>
            <Text style={styles.walletLabel}>
              {isProvider ? "Available Earnings Balance" : "Active AI & Platform Credits"}
            </Text>
            <Text style={styles.walletAmount}>
              {isProvider
                ? `$${(user?.wallet?.balance || 2450.0).toFixed(2)}`
                : `${user?.credits || 250} Credits`}
            </Text>
          </View>
          <View style={styles.walletIconBox}>
            {isProvider ? <Wallet size={24} color="#ffffff" /> : <Coins size={24} color="#ffffff" />}
          </View>
        </View>

        {isProvider && (
          <View style={styles.pendingRow}>
            <Text style={styles.pendingText}>
              Pending Clearance: ${(user?.wallet?.pendingBalance || 120.0).toFixed(2)}
            </Text>
            <Text style={styles.pendingText}>Threshold: $10.00</Text>
          </View>
        )}

        <View style={styles.walletActionsRow}>
          {isProvider ? (
            <TouchableOpacity
              style={styles.walletActionBtn}
              onPress={() => setIsPayoutSheetOpen(true)}
              activeOpacity={0.8}
            >
              <ArrowUpRight size={16} color={themeConfig.colors.primary[500]} />
              <Text style={styles.walletActionBtnText}>Request Payout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.walletActionBtn}
              onPress={() => setActiveTab("PACKAGES")}
              activeOpacity={0.8}
            >
              <Coins size={16} color={themeConfig.colors.primary[500]} />
              <Text style={styles.walletActionBtnText}>Buy Credits</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.walletActionBtn, styles.walletActionBtnOutline]}
            onPress={() => setActiveTab("HISTORY")}
            activeOpacity={0.8}
          >
            <CreditCard size={16} color="#ffffff" />
            <Text style={[styles.walletActionBtnText, { color: "#ffffff" }]}>
              Ledger
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Tab Navigation */}
      <View style={[styles.tabSelector, { backgroundColor: colors.cardSubtle }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "WALLET" && [styles.tabBtnActive, { backgroundColor: colors.card }]]}
          onPress={() => setActiveTab("WALLET")}
        >
          <Text style={[styles.tabBtnText, { color: activeTab === "WALLET" ? colors.textPrimary : colors.textSecondary }]}>
            Gateways
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "PACKAGES" && [styles.tabBtnActive, { backgroundColor: colors.card }]]}
          onPress={() => setActiveTab("PACKAGES")}
        >
          <Text style={[styles.tabBtnText, { color: activeTab === "PACKAGES" ? colors.textPrimary : colors.textSecondary }]}>
            Credit Packs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "HISTORY" && [styles.tabBtnActive, { backgroundColor: colors.card }]]}
          onPress={() => setActiveTab("HISTORY")}
        >
          <Text style={[styles.tabBtnText, { color: activeTab === "HISTORY" ? colors.textPrimary : colors.textSecondary }]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Multi-Country Gateways */}
      {activeTab === "WALLET" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Supported Multi-Country Gateways
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Choose your preferred currency and checkout engine:
          </Text>

          <View style={styles.gatewayGrid}>
            {GATEWAYS.map((gw) => {
              const isSelected = selectedGateway === gw.id;
              return (
                <TouchableOpacity
                  key={gw.id}
                  style={[
                    styles.gatewayCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? themeConfig.colors.primary[500] : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedGateway(gw.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.gatewayFlag}>{gw.flag}</Text>
                  <Text style={[styles.gatewayLabel, { color: colors.textPrimary }]}>
                    {gw.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedDot}>
                      <CheckCircle2 size={14} color={themeConfig.colors.primary[500]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Tab 2: Credit Packages */}
      {activeTab === "PACKAGES" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Top-up Credits Packages
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Credits are usable across AI tools, consultations, and bookings.
          </Text>

          {packages.map((pkg) => (
            <View
              key={pkg.id}
              style={[
                styles.packageCard,
                { backgroundColor: colors.card, borderColor: pkg.popular ? themeConfig.colors.primary[500] : colors.border },
              ]}
            >
              {pkg.popular && (
                <View style={[styles.popularBadge, { backgroundColor: themeConfig.colors.primary[500] }]}>
                  <Sparkles size={12} color="#ffffff" />
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.packageHeader}>
                <View>
                  <Text style={[styles.packageName, { color: colors.textPrimary }]}>
                    {pkg.name}
                  </Text>
                  <Text style={[styles.packageCredits, { color: themeConfig.colors.primary[500] }]}>
                    {pkg.credits} Credits
                  </Text>
                </View>
                <Text style={[styles.packagePrice, { color: colors.textPrimary }]}>
                  ${pkg.price}
                </Text>
              </View>

              <View style={styles.packageFeaturesList}>
                {pkg.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                      {feat}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.buyBtn,
                  { backgroundColor: themeConfig.colors.primary[500] },
                  isSubmitting && styles.buyBtnDisabled,
                ]}
                onPress={() => handlePurchasePackage(pkg)}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.buyBtnText}>Purchase with {selectedGateway}</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Tab 3: Transaction History */}
      {activeTab === "HISTORY" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Transaction Ledger
          </Text>

          {transactions.map((tx) => (
            <View
              key={tx.id}
              style={[styles.txItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View
                style={[
                  styles.txIconBox,
                  {
                    backgroundColor:
                      tx.type === "PROVIDER_PAYOUT"
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(16, 185, 129, 0.15)",
                  },
                ]}
              >
                {tx.type === "PROVIDER_PAYOUT" ? (
                  <ArrowUpRight size={18} color="#ef4444" />
                ) : (
                  <ArrowDownLeft size={18} color="#10b981" />
                )}
              </View>

              <View style={styles.txInfo}>
                <Text style={[styles.txDesc, { color: colors.textPrimary }]}>
                  {tx.description}
                </Text>
                <Text style={[styles.txMeta, { color: colors.textMuted }]}>
                  {tx.gateway} • {new Date(tx.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.txAmountCol}>
                <Text
                  style={[
                    styles.txAmount,
                    {
                      color: tx.type === "PROVIDER_PAYOUT" ? "#ef4444" : "#10b981",
                    },
                  ]}
                >
                  {tx.type === "PROVIDER_PAYOUT" ? `-$${tx.amount}` : `+$${tx.amount}`}
                </Text>
                <Text style={[styles.txStatus, { color: colors.textSecondary }]}>
                  {tx.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Payout Request Modal with Biometrics */}
      <Modal
        visible={isPayoutSheetOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPayoutSheetOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Request Payout
              </Text>
              <TouchableOpacity onPress={() => setIsPayoutSheetOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Enter withdrawal amount and bank/payout destination. Biometric authorization is required.
            </Text>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                Withdrawal Amount ($ USD)
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="150.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={payoutAmount}
                onChangeText={setPayoutAmount}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                Account / Bank / Mobile IBAN
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="IBAN / Routing / Wallet Number"
                placeholderTextColor={colors.textMuted}
                value={payoutAccount}
                onChangeText={setPayoutAccount}
              />
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={handleRequestPayout}
              disabled={isSubmitting}
            >
              <Fingerprint size={20} color="#ffffff" />
              <Text style={styles.modalSubmitText}>
                Authorize & Disburse with Biometrics
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Manual Trx Submission Modal */}
      <Modal
        visible={isManualTrxModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsManualTrxModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Direct Bank / Mobile Trx Verification
              </Text>
              <TouchableOpacity onPress={() => setIsManualTrxModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Send payment to Bank/bKash and submit Transaction ID for rapid activation:
            </Text>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                Transaction ID (TrxID / Reference)
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="e.g. 9J2048201 or REF-4820"
                placeholderTextColor={colors.textMuted}
                value={manualTrxId}
                onChangeText={setManualTrxId}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                Sender Account / Mobile Number
              </Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="+1 555-0199 or 017xxxxxxxx"
                placeholderTextColor={colors.textMuted}
                value={manualSender}
                onChangeText={setManualSender}
              />
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={handleSubmitManualTrx}
              disabled={isSubmitting}
            >
              <Text style={styles.modalSubmitText}>Submit Trx for Verification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  walletCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: themeConfig.colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  walletHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  walletLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
    fontWeight: "600",
  },
  walletAmount: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
  },
  walletIconBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 14,
  },
  pendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  pendingText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
  },
  walletActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  walletActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  walletActionBtnOutline: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  walletActionBtnText: {
    color: themeConfig.colors.primary[500],
    fontSize: 13,
    fontWeight: "700",
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
    fontSize: 13,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  gatewayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gatewayCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    position: "relative",
  },
  gatewayFlag: {
    fontSize: 26,
    marginBottom: 6,
  },
  gatewayLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  selectedDot: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  packageCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: "700",
  },
  packageCredits: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: "800",
  },
  packageFeaturesList: {
    gap: 6,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
  },
  buyBtn: {
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buyBtnDisabled: {
    opacity: 0.6,
  },
  buyBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: 13,
    fontWeight: "600",
  },
  txMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: "flex-end",
  },
  txAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  txStatus: {
    fontSize: 11,
    marginTop: 2,
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
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalDesc: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalInputGroup: {
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 14,
    gap: 8,
    marginTop: 10,
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
