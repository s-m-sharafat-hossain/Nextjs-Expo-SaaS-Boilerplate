import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Search,
  Star,
  Heart,
  Calendar,
  Clock,
  ShieldCheck,
  Video,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useConsumerPortalController, CATEGORIES, ConsumerPortalTab } from "./consumer.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

const TIME_SLOTS = ["09:30 AM", "11:00 AM", "02:30 PM", "04:15 PM"];
const DATES = ["Today", "Tomorrow", "In 2 Days"];

export const ConsumerPortalScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    services,
    timelines,
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedService,
    slotDate,
    setSlotDate,
    slotTime,
    setSlotTime,
    selectedGateway,
    setSelectedGateway,
    isLoading,
    isSubmittingBooking,
    error,
    successMessage,
    loadData,
    handleToggleWishlist,
    handleOpenBooking,
    handleConfirmBooking,
  } = useConsumerPortalController();

  return (
    <StandardMobileScreenShell
      title="Consumer Hub"
      subtitle="Discover Verified Providers, Book & Track Orders"
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

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search doctors, lawyers, consultants, or skills..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation Ribbon */}
      <View style={[styles.tabSelector, { backgroundColor: colors.cardSubtle }]}>
        {(
          [
            { id: "EXPLORE", label: "Marketplace" },
            { id: "TIMELINE", label: `Timeline (${timelines.length})` },
            { id: "SAVED", label: "Wishlist" },
          ] as { id: ConsumerPortalTab; label: string }[]
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

      {/* Category Filter Pills (Only in Explore mode) */}
      {activeTab === "EXPLORE" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                {
                  backgroundColor: selectedCategory === cat ? themeConfig.colors.primary[500] : colors.card,
                  borderColor: selectedCategory === cat ? themeConfig.colors.primary[500] : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  { color: selectedCategory === cat ? "#ffffff" : colors.textPrimary },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Tab 1 & 3: Services Cards List (Explore & Wishlist) */}
      {(activeTab === "EXPLORE" || activeTab === "SAVED") && (
        <View style={styles.servicesList}>
          {services.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {activeTab === "SAVED" ? "No saved services in your wishlist." : "No services found matching your criteria."}
              </Text>
            </View>
          ) : (
            services.map((item) => (
              <View
                key={item.id}
                style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.serviceTopRow}>
                  <Image
                    source={{ uri: item.providerImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150" }}
                    style={styles.providerAvatar}
                  />
                  <View style={styles.providerMetaCol}>
                    <View style={styles.providerNameRow}>
                      <Text style={[styles.providerName, { color: colors.textPrimary }]}>
                        {item.providerName}
                      </Text>
                      <ShieldCheck size={14} color="#10b981" />
                    </View>
                    <Text style={[styles.specialtyText, { color: colors.textSecondary }]}>
                      {item.providerSpecialty}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={() => handleToggleWishlist(item.id)}
                  >
                    <Heart
                      size={20}
                      color={item.isWishlisted ? "#ef4444" : colors.textMuted}
                      fill={item.isWishlisted ? "#ef4444" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>

                <View style={styles.serviceRatingRow}>
                  <View style={styles.ratingBox}>
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <Text style={[styles.ratingVal, { color: colors.textPrimary }]}>
                      {item.rating}
                    </Text>
                    <Text style={[styles.reviewsCount, { color: colors.textMuted }]}>
                      ({item.reviewsCount} reviews)
                    </Text>
                  </View>
                  <Text style={[styles.durationBadge, { color: colors.textSecondary }]}>
                    {item.durationMinutes} mins video session
                  </Text>
                </View>

                <View style={styles.serviceFooterRow}>
                  <View>
                    <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Session Fee</Text>
                    <Text style={[styles.priceVal, { color: themeConfig.colors.primary[500] }]}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.bookBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                    onPress={() => handleOpenBooking(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bookBtnText}>Book Appointment</Text>
                    <ArrowRight size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Tab 2: Live Booking Status Timeline */}
      {activeTab === "TIMELINE" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Active Appointment & Service Timeline
          </Text>

          {timelines.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No active bookings in progress. Browse the marketplace to book.
              </Text>
            </View>
          ) : (
            timelines.map((tl) => (
              <View
                key={tl.id}
                style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.timelineHeader}>
                  <View>
                    <Text style={[styles.timelineNum, { color: themeConfig.colors.primary[500] }]}>
                      {tl.bookingNumber}
                    </Text>
                    <Text style={[styles.timelineService, { color: colors.textPrimary }]}>
                      {tl.serviceTitle}
                    </Text>
                    <Text style={[styles.timelineProvider, { color: colors.textSecondary }]}>
                      with {tl.providerName}
                    </Text>
                  </View>
                  <Text style={[styles.timelinePrice, { color: "#10b981" }]}>
                    ${tl.amount.toFixed(2)}
                  </Text>
                </View>

                {/* Progress Steps */}
                <View style={styles.stepsContainer}>
                  {tl.steps.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepIndicatorCol}>
                        <View
                          style={[
                            styles.stepDot,
                            {
                              backgroundColor: step.completed
                                ? "#10b981"
                                : step.current
                                ? themeConfig.colors.primary[500]
                                : colors.border,
                            },
                          ]}
                        >
                          {step.completed && <CheckCircle2 size={12} color="#ffffff" />}
                        </View>
                        {idx < tl.steps.length - 1 && (
                          <View
                            style={[
                              styles.stepLine,
                              { backgroundColor: step.completed ? "#10b981" : colors.border },
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.stepContent}>
                        <Text
                          style={[
                            styles.stepTitle,
                            { color: step.completed || step.current ? colors.textPrimary : colors.textMuted },
                          ]}
                        >
                          {step.title}
                        </Text>
                        <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                          {step.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {tl.meetingUrl && (
                  <TouchableOpacity
                    style={[styles.joinVideoBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
                    onPress={() => {}}
                  >
                    <Video size={16} color="#ffffff" />
                    <Text style={styles.joinVideoText}>Join Consultation Video Room</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {/* Booking Slot Picker & Multi-Country Checkout Modal */}
      <Modal
        visible={isBookingModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsBookingModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select Slot & Checkout
              </Text>
              <TouchableOpacity onPress={() => setIsBookingModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedService && (
              <View style={[styles.modalServiceSnippet, { backgroundColor: colors.cardSubtle }]}>
                <Text style={[styles.modalServiceName, { color: colors.textPrimary }]}>
                  {selectedService.title}
                </Text>
                <Text style={[styles.modalServiceFee, { color: themeConfig.colors.primary[500] }]}>
                  ${selectedService.price.toFixed(2)} USD • {selectedService.durationMinutes} mins
                </Text>
              </View>
            )}

            {/* Date Selection */}
            <Text style={[styles.modalSectionLabel, { color: colors.textSecondary }]}>Choose Date</Text>
            <View style={styles.modalPillRow}>
              {DATES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.modalPill,
                    {
                      backgroundColor: slotDate === d ? themeConfig.colors.primary[500] : colors.inputBackground,
                      borderColor: slotDate === d ? themeConfig.colors.primary[500] : colors.border,
                    },
                  ]}
                  onPress={() => setSlotDate(d)}
                >
                  <Text style={[styles.modalPillText, { color: slotDate === d ? "#ffffff" : colors.textPrimary }]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slot Selection */}
            <Text style={[styles.modalSectionLabel, { color: colors.textSecondary }]}>Available Times</Text>
            <View style={styles.modalPillRow}>
              {TIME_SLOTS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.modalPill,
                    {
                      backgroundColor: slotTime === t ? themeConfig.colors.primary[500] : colors.inputBackground,
                      borderColor: slotTime === t ? themeConfig.colors.primary[500] : colors.border,
                    },
                  ]}
                  onPress={() => setSlotTime(t)}
                >
                  <Text style={[styles.modalPillText, { color: slotTime === t ? "#ffffff" : colors.textPrimary }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Gateway Picker */}
            <Text style={[styles.modalSectionLabel, { color: colors.textSecondary }]}>Payment Gateway</Text>
            <View style={styles.modalPillRow}>
              {(["STRIPE", "PAYPAL", "BKASH", "SSLCOMMERZ"] as const).map((gw) => (
                <TouchableOpacity
                  key={gw}
                  style={[
                    styles.modalPill,
                    {
                      backgroundColor: selectedGateway === gw ? themeConfig.colors.primary[500] : colors.inputBackground,
                      borderColor: selectedGateway === gw ? themeConfig.colors.primary[500] : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedGateway(gw)}
                >
                  <Text style={[styles.modalPillText, { color: selectedGateway === gw ? "#ffffff" : colors.textPrimary }]}>
                    {gw}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[styles.modalConfirmBtn, { backgroundColor: themeConfig.colors.primary[500] }]}
              onPress={handleConfirmBooking}
              disabled={isSubmittingBooking}
            >
              {isSubmittingBooking ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalConfirmText}>
                  Confirm & Pay ${selectedService?.price.toFixed(2)}
                </Text>
              )}
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabSelector: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 14,
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
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  servicesList: {
    gap: 12,
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
  serviceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  serviceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 10,
  },
  providerMetaCol: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  specialtyText: {
    fontSize: 11,
    marginTop: 2,
  },
  wishlistBtn: {
    padding: 6,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 8,
  },
  serviceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: "700",
  },
  reviewsCount: {
    fontSize: 11,
  },
  durationBadge: {
    fontSize: 11,
  },
  serviceFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.1)",
  },
  priceLabel: {
    fontSize: 10,
    textTransform: "uppercase",
  },
  priceVal: {
    fontSize: 18,
    fontWeight: "800",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  bookBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  timelineCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  timelineNum: {
    fontSize: 12,
    fontWeight: "800",
  },
  timelineService: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  timelineProvider: {
    fontSize: 12,
    marginTop: 2,
  },
  timelinePrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  stepsContainer: {
    marginVertical: 10,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  stepIndicatorCol: {
    alignItems: "center",
    marginRight: 10,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  stepDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  joinVideoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    marginTop: 6,
  },
  joinVideoText: {
    color: "#ffffff",
    fontSize: 13,
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
  modalServiceSnippet: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  modalServiceName: {
    fontSize: 14,
    fontWeight: "700",
  },
  modalServiceFee: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  modalPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalConfirmBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  modalConfirmText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
