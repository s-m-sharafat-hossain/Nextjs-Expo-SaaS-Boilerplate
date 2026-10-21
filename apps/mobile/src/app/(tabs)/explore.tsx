// apps/mobile/src/app/(tabs)/explore.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  Star,
  Clock,
  Tag,
  ArrowRight,
  Plus,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

interface DemoListing {
  id: string;
  title: string;
  providerName: string;
  category: string;
  price: number;
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  tags: string[];
}

const DEMO_SERVICES: DemoListing[] = [
  {
    id: "srv-1",
    title: "Comprehensive Health & Specialist Review",
    providerName: "Dr. Sarah Mitchell, MD",
    category: "Telehealth Consultation",
    price: 120,
    durationMinutes: 45,
    rating: 4.9,
    reviewsCount: 38,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Virtual Visit", "Prescription", "Health Check"],
  },
  {
    id: "srv-2",
    title: "Rapid Clinical Second Opinion & Diagnostics",
    providerName: "Dr. Sarah Mitchell, MD",
    category: "Diagnostics Review",
    price: 80,
    durationMinutes: 30,
    rating: 5.0,
    reviewsCount: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Second Opinion", "Lab Triage", "Diagnostics"],
  },
];

export default function ExploreScreen() {
  const { activeRole } = useAuthStore();
  const { colors } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Telehealth", "Diagnostics", "AI Review", "Emergency"];

  return (
    <StandardMobileScreenShell
      title={activeRole === "PROVIDER" ? "My Services & Listings" : "Discover Services"}
      subtitle={
        activeRole === "PROVIDER"
          ? "Manage your bookable catalog & rates"
          : "Verified specialist consultations"
      }
      showSearchButton
    >
      {/* Category Filter Chips */}
      <View style={styles.categoriesRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.catChip,
              {
                backgroundColor:
                  selectedCategory === cat
                    ? themeConfig.colors.primary[500]
                    : colors.card,
                borderColor:
                  selectedCategory === cat
                    ? themeConfig.colors.primary[500]
                    : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                {
                  color: selectedCategory === cat ? "#ffffff" : colors.textPrimary,
                  fontWeight: selectedCategory === cat ? "700" : "500",
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Services List */}
      <View style={styles.servicesList}>
        {DEMO_SERVICES.map((item) => (
          <View
            key={item.id}
            style={[
              styles.serviceCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

            <View style={styles.cardBody}>
              <View style={styles.categoryBadgeRow}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: `${themeConfig.colors.primary[500]}15` },
                  ]}
                >
                  <Tag size={12} color={themeConfig.colors.primary[500]} />
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: themeConfig.colors.primary[500] },
                    ]}
                  >
                    {item.category}
                  </Text>
                </View>

                <View style={styles.ratingBadge}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                    {item.rating} ({item.reviewsCount})
                  </Text>
                </View>
              </View>

              <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.providerName, { color: colors.textSecondary }]}
              >
                {item.providerName}
              </Text>

              {/* Price & Booking Trigger */}
              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <View style={styles.durationRow}>
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={[styles.durationText, { color: colors.textMuted }]}>
                    {item.durationMinutes} min
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={[styles.priceText, { color: colors.textPrimary }]}>
                    ${item.price}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.bookBtn,
                      { backgroundColor: themeConfig.colors.primary[500] },
                    ]}
                  >
                    <Text style={styles.bookBtnText}>
                      {activeRole === "PROVIDER" ? "Edit" : "Book"}
                    </Text>
                    <ArrowRight size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Provider Add Service Floating Bar */}
      {activeRole === "PROVIDER" && (
        <TouchableOpacity
          style={[
            styles.addServiceBtn,
            { backgroundColor: themeConfig.colors.primary[500] },
          ]}
        >
          <Plus size={18} color="#ffffff" />
          <Text style={styles.addServiceBtnText}>Create New Service Listing</Text>
        </TouchableOpacity>
      )}
    </StandardMobileScreenShell>
  );
}

const styles = StyleSheet.create({
  categoriesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardBody: {
    padding: 14,
  },
  categoryBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  providerName: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  bookBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  addServiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  addServiceBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
