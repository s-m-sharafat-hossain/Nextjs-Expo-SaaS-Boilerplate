import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  LifeBuoy,
  MessageSquarePlus,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  HelpCircle,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useSupportController, FAQ_ITEMS } from "./support.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";
import { TicketCategoryType, TicketPriorityType } from "./support.schema";

const CATEGORIES: { id: TicketCategoryType; label: string }[] = [
  { id: "GENERAL_INQUIRY", label: "General" },
  { id: "BILLING", label: "Billing & Refund" },
  { id: "TECHNICAL", label: "Technical Bug" },
  { id: "BOOKING_DISPUTE", label: "Dispute / Complaint" },
];

export const SupportScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    tickets,
    expandedFaqIndex,
    toggleFaq,
    isNewTicketOpen,
    setIsNewTicketOpen,
    subject,
    setSubject,
    category,
    setCategory,
    priority,
    setPriority,
    message,
    setMessage,
    isReviewOpen,
    setIsReviewOpen,
    rating,
    setRating,
    reviewTitle,
    setReviewTitle,
    reviewComment,
    setReviewComment,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadTickets,
    handleCreateTicket,
    handleSubmitReview,
  } = useSupportController();

  return (
    <StandardMobileScreenShell
      title="Support & Feedback"
      subtitle="Help Center, Disputes & Verified Reviews"
      isLoading={isLoading}
      onRefresh={loadTickets}
    >
      {/* Success Notification */}
      {successMessage && (
        <View style={styles.successBox}>
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {/* Error Notification */}
      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
          onPress={() => setIsNewTicketOpen(true)}
          activeOpacity={0.8}
        >
          <MessageSquarePlus size={16} color="#ffffff" />
          <Text style={styles.primaryActionText}>Open Ticket / Dispute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setIsReviewOpen(true)}
          activeOpacity={0.8}
        >
          <Star size={16} color="#f59e0b" />
          <Text style={[styles.secondaryActionText, { color: colors.textPrimary }]}>
            Write Review
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Tickets Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <LifeBuoy size={16} color={themeConfig.colors.primary[500]} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            My Support Tickets ({tickets.length})
          </Text>
        </View>

        {tickets.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No active support tickets or disputes.
            </Text>
          </View>
        ) : (
          tickets.map((t) => (
            <View
              key={t.id}
              style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketNum, { color: themeConfig.colors.primary[500] }]}>
                  {t.ticketNumber}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        t.status === "RESOLVED"
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: t.status === "RESOLVED" ? "#10b981" : "#f59e0b" },
                    ]}
                  >
                    {t.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.ticketSubject, { color: colors.textPrimary }]}>
                {t.subject}
              </Text>

              {t.lastResponse && (
                <View style={[styles.responseBox, { backgroundColor: colors.cardSubtle }]}>
                  <Text style={[styles.responseLabel, { color: colors.textMuted }]}>
                    Staff Response:
                  </Text>
                  <Text style={[styles.responseText, { color: colors.textSecondary }]}>
                    {t.lastResponse}
                  </Text>
                </View>
              )}

              <View style={styles.ticketFooter}>
                <Text style={[styles.ticketCategory, { color: colors.textMuted }]}>
                  Category: {t.category}
                </Text>
                <Text style={[styles.ticketDate, { color: colors.textMuted }]}>
                  {new Date(t.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Frequently Asked Questions Accordion */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <HelpCircle size={16} color={themeConfig.colors.primary[500]} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Frequently Asked Questions
          </Text>
        </View>

        {FAQ_ITEMS.map((faq, idx) => {
          const isExpanded = expandedFaqIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => toggleFaq(idx)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                  {faq.q}
                </Text>
                {isExpanded ? (
                  <ChevronUp size={18} color={colors.textSecondary} />
                ) : (
                  <ChevronDown size={18} color={colors.textSecondary} />
                )}
              </View>

              {isExpanded && (
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  {faq.a}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* New Ticket Modal */}
      <Modal
        visible={isNewTicketOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsNewTicketOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                New Support Ticket or Dispute
              </Text>
              <TouchableOpacity onPress={() => setIsNewTicketOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Subject</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Brief summary of your issue..."
                placeholderTextColor={colors.textMuted}
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: category === cat.id ? themeConfig.colors.primary[500] : colors.cardSubtle,
                      },
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: category === cat.id ? "#ffffff" : colors.textPrimary },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.modalTextArea, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Please describe what happened, order IDs, or specific questions..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={handleCreateTicket}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalSubmitText}>Submit Ticket</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={isReviewOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsReviewOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Submit Verified Review
              </Text>
              <TouchableOpacity onPress={() => setIsReviewOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.starPickerRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} style={styles.starBtn}>
                  <Star
                    size={32}
                    color="#f59e0b"
                    fill={s <= rating ? "#f59e0b" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Review Headline</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Outstanding experience and quick answers!"
                placeholderTextColor={colors.textMuted}
                value={reviewTitle}
                onChangeText={setReviewTitle}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Your Feedback</Text>
              <TextInput
                style={[styles.modalTextArea, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Share your detailed feedback to assist future consumers and providers..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={reviewComment}
                onChangeText={setReviewComment}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={() => handleSubmitReview()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalSubmitText}>Post Verified Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </StandardMobileScreenShell>
  );
};

const styles = StyleSheet.create({
  successBox: {
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
  errorBox: {
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
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
  },
  ticketCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  ticketNum: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ticketSubject: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  responseBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 2,
  },
  responseText: {
    fontSize: 12,
    lineHeight: 16,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  ticketCategory: {
    fontSize: 11,
  },
  ticketDate: {
    fontSize: 11,
  },
  faqItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.1)",
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalInputGroup: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  modalInput: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  modalTextArea: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  starPickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  starBtn: {
    padding: 4,
  },
  modalSubmitBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  modalSubmitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
