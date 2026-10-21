// apps/mobile/src/shared/layouts/StandardMobileScreenShell.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Bell,
  Search,
  AlertCircle,
  Inbox,
  RefreshCw,
} from "lucide-react-native";
import { useAuthStore } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";
import { appConfig } from "@shared/config";
import { themeConfig } from "@shared/config";

export interface StandardMobileScreenShellProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showRoleBadge?: boolean;
  showNotificationBell?: boolean;
  showSearchButton?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  headerRightSlot?: React.ReactNode;
  
  // Loading & Error States
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
  onRetry?: () => void;

  // Empty State
  isEmpty?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;

  // Layout & Content
  children: React.ReactNode;
  bottomActionSlot?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: object;
  isOffline?: boolean;
}

export const StandardMobileScreenShell: React.FC<StandardMobileScreenShellProps> = ({
  title,
  subtitle,
  showBack = false,
  showRoleBadge = true,
  showNotificationBell = true,
  showSearchButton = false,
  onSearchPress,
  onNotificationPress,
  headerRightSlot,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  error = null,
  onRetry,
  isEmpty = false,
  emptyTitle = "No Items Found",
  emptySubtitle = "There is no data to display right now.",
  emptyActionLabel,
  onEmptyAction,
  children,
  bottomActionSlot,
  scrollable = true,
  contentContainerStyle,
  isOffline = false,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeRole } = useAuthStore();
  const { isDark, colors } = useThemeStore();
  const screenWidth = Dimensions.get("window").width;
  const isTablet = screenWidth >= 768;

  const roleMeta =
    activeRole === "ADMIN"
      ? appConfig.roleLabels.admin
      : activeRole === "PROVIDER"
      ? appConfig.roleLabels.provider
      : appConfig.roleLabels.consumer;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.headerBackground}
      />

      {/* Offline Alert Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <AlertCircle size={14} color="#ffffff" />
          <Text style={styles.offlineText}>
            You are currently offline. Showing cached information.
          </Text>
        </View>
      )}

      {/* 1. STICKY RESPONSIVE HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.iconButton, { borderColor: colors.border }]}
              accessibilityLabel="Go back"
            >
              <ChevronLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}

          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.titleText,
                  { color: colors.textPrimary },
                  isTablet && styles.titleTextTablet,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>

              {showRoleBadge && (
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: `${roleMeta.badgeColor}20` },
                  ]}
                >
                  <Text
                    style={[styles.roleBadgeText, { color: roleMeta.badgeColor }]}
                  >
                    {roleMeta.key}
                  </Text>
                </View>
              )}
            </View>

            {subtitle && (
              <Text
                style={[styles.subtitleText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Header Right Actions */}
        <View style={styles.headerRight}>
          {showSearchButton && (
            <TouchableOpacity
              onPress={onSearchPress}
              style={[styles.iconButton, { borderColor: colors.border }]}
              accessibilityLabel="Search"
            >
              <Search size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {showNotificationBell && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={[styles.iconButton, { borderColor: colors.border }]}
              accessibilityLabel="Notifications"
            >
              <Bell size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {headerRightSlot}
        </View>
      </View>

      {/* 2. BODY CONTENT & STATES */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={themeConfig.colors.primary[500]} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading data...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <AlertCircle size={44} color={themeConfig.colors.status.danger} />
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            {error}
          </Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={[styles.retryButton, { backgroundColor: themeConfig.colors.primary[500] }]}
            >
              <RefreshCw size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : isEmpty ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: isDark ? "#1e293b" : "#f1f5f9" },
            ]}
          >
            <Inbox size={38} color={themeConfig.colors.primary[400]} />
          </View>
          <Text style={[styles.emptyTitleText, { color: colors.textPrimary }]}>
            {emptyTitle}
          </Text>
          <Text style={[styles.emptySubtitleText, { color: colors.textSecondary }]}>
            {emptySubtitle}
          </Text>
          {emptyActionLabel && onEmptyAction && (
            <TouchableOpacity
              onPress={onEmptyAction}
              style={[styles.emptyActionButton, { backgroundColor: themeConfig.colors.primary[500] }]}
            >
              <Text style={styles.emptyActionButtonText}>{emptyActionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.scrollContentTablet,
            contentContainerStyle,
          ]}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={themeConfig.colors.primary[500]}
                colors={[themeConfig.colors.primary[500]]}
              />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.nonScrollContent,
            isTablet && styles.scrollContentTablet,
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}

      {/* 3. BOTTOM ACTION SLOT / SHEET */}
      {bottomActionSlot && (
        <View
          style={[
            styles.bottomSlot,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          {bottomActionSlot}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  offlineBanner: {
    backgroundColor: "#b91c1c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  offlineText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  titleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
  },
  titleTextTablet: {
    fontSize: 22,
  },
  subtitleText: {
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  scrollContentTablet: {
    maxWidth: 960,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 24,
  },
  nonScrollContent: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
  },
  errorSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitleText: {
    fontSize: 17,
    fontWeight: "700",
  },
  emptySubtitleText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
    maxWidth: 280,
  },
  emptyActionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyActionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSlot: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
