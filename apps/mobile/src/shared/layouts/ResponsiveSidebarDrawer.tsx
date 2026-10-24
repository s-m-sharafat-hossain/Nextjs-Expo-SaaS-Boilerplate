// apps/mobile/src/shared/layouts/ResponsiveSidebarDrawer.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  X,
  Shield,
  ShieldAlert,
  Briefcase,
  User,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Calendar,
  Grid,
  Sparkles,
  LifeBuoy,
} from "lucide-react-native";
import { useAuthStore } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";
import { appConfig, RoleType } from "@shared/config";
import { themeConfig } from "@shared/config";

interface ResponsiveSidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export const ResponsiveSidebarDrawer: React.FC<ResponsiveSidebarDrawerProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const { user, activeRole, switchRole, logout } = useAuthStore();
  const { colors } = useThemeStore();

  const handleRoleSelect = async (role: RoleType) => {
    await switchRole(role);
    onClose();
    router.replace("/(tabs)");
  };

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.drawerContainer,
            {
              backgroundColor: colors.surface,
              borderRightColor: colors.border,
            },
          ]}
        >
          {/* Header & Close */}
          <View
            style={[
              styles.drawerHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.brandRow}>
              <View
                style={[
                  styles.brandLogo,
                  { backgroundColor: themeConfig.colors.primary[500] },
                ]}
              >
                <Text style={styles.brandLogoText}>M</Text>
              </View>
              <View>
                <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
                  {appConfig.shortName}
                </Text>
                <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
                  Enterprise Portal
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { borderColor: colors.border }]}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {/* User Profile Card */}
            {user && (
              <View
                style={[
                  styles.userCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Image
                  source={{
                    uri:
                      user.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>
                    {user.name}
                  </Text>
                  <Text
                    style={[styles.userEmail, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.planBadge,
                        { backgroundColor: `${themeConfig.colors.primary[500]}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.planBadgeText,
                          { color: themeConfig.colors.primary[500] },
                        ]}
                      >
                        {user.plan || "PRO"}
                      </Text>
                    </View>
                    <Text
                      style={[styles.creditsText, { color: colors.textSecondary }]}
                    >
                      {user.credits ?? 25} credits
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* 1-Click Role Switcher */}
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
              ACTIVE ROLE PORTAL
            </Text>
            <View style={styles.roleGrid}>
              {(user?.role === "SUPER_ADMIN" || activeRole === "SUPER_ADMIN") && (
                <TouchableOpacity
                  onPress={() => handleRoleSelect("SUPER_ADMIN")}
                  style={[
                    styles.roleCard,
                    {
                      borderColor:
                        activeRole === "SUPER_ADMIN"
                          ? "#9333ea"
                          : colors.border,
                      backgroundColor:
                        activeRole === "SUPER_ADMIN"
                          ? "#9333ea15"
                          : colors.card,
                    },
                  ]}
                >
                  <ShieldAlert
                    size={18}
                    color="#9333ea"
                  />
                  <Text
                    style={[
                      styles.roleCardText,
                      {
                        color:
                          activeRole === "SUPER_ADMIN"
                            ? "#9333ea"
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    Super Admin
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleRoleSelect("ADMIN")}
                style={[
                  styles.roleCard,
                  {
                    borderColor:
                      activeRole === "ADMIN"
                        ? appConfig.roleLabels.admin.badgeColor
                        : colors.border,
                    backgroundColor:
                      activeRole === "ADMIN"
                        ? `${appConfig.roleLabels.admin.badgeColor}15`
                        : colors.card,
                  },
                ]}
              >
                <Shield
                  size={18}
                  color={appConfig.roleLabels.admin.badgeColor}
                />
                <Text
                  style={[
                    styles.roleCardText,
                    {
                      color:
                        activeRole === "ADMIN"
                          ? appConfig.roleLabels.admin.badgeColor
                          : colors.textPrimary,
                    },
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRoleSelect("PROVIDER")}
                style={[
                  styles.roleCard,
                  {
                    borderColor:
                      activeRole === "PROVIDER"
                        ? appConfig.roleLabels.provider.badgeColor
                        : colors.border,
                    backgroundColor:
                      activeRole === "PROVIDER"
                        ? `${appConfig.roleLabels.provider.badgeColor}15`
                        : colors.card,
                  },
                ]}
              >
                <Briefcase
                  size={18}
                  color={appConfig.roleLabels.provider.badgeColor}
                />
                <Text
                  style={[
                    styles.roleCardText,
                    {
                      color:
                        activeRole === "PROVIDER"
                          ? appConfig.roleLabels.provider.badgeColor
                          : colors.textPrimary,
                    },
                  ]}
                >
                  Provider
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRoleSelect("CONSUMER")}
                style={[
                  styles.roleCard,
                  {
                    borderColor:
                      activeRole === "CONSUMER"
                        ? appConfig.roleLabels.consumer.badgeColor
                        : colors.border,
                    backgroundColor:
                      activeRole === "CONSUMER"
                        ? `${appConfig.roleLabels.consumer.badgeColor}15`
                        : colors.card,
                  },
                ]}
              >
                <User
                  size={18}
                  color={appConfig.roleLabels.consumer.badgeColor}
                />
                <Text
                  style={[
                    styles.roleCardText,
                    {
                      color:
                        activeRole === "CONSUMER"
                          ? appConfig.roleLabels.consumer.badgeColor
                          : colors.textPrimary,
                    },
                  ]}
                >
                  Consumer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Navigation Links */}
            <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
              NAVIGATION
            </Text>

            <TouchableOpacity
              onPress={() => navigateTo("/(tabs)")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <Grid size={18} color={colors.textSecondary} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                Dashboard Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/(tabs)/bookings")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                Bookings & Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/chat")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <MessageSquare size={18} color={themeConfig.colors.primary[400]} />
              <Text
                style={[
                  styles.navItemText,
                  { color: themeConfig.colors.primary[400], fontWeight: "600" },
                ]}
              >
                AI Assistant (n8n Chat)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/ai")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <Sparkles size={18} color={themeConfig.colors.primary[500]} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                AI Engine & Copilot Studio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/support")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <LifeBuoy size={18} color={colors.textSecondary} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                Support & Verified Reviews
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/(tabs)/wallet")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <CreditCard size={18} color={colors.textSecondary} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                Wallet & Billing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo("/(tabs)/profile")}
              style={[styles.navItem, { borderColor: colors.border }]}
            >
              <Settings size={18} color={colors.textSecondary} />
              <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                Settings & Security
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer & Logout */}
          <View
            style={[
              styles.drawerFooter,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <TouchableOpacity
              onPress={async () => {
                onClose();
                await logout();
                router.replace("/(auth)/login");
              }}
              style={styles.logoutBtn}
            >
              <LogOut size={18} color={themeConfig.colors.status.danger} />
              <Text style={styles.logoutText}>Sign Out of Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  drawerContainer: {
    width: "82%",
    maxWidth: 340,
    height: "100%",
    borderRightWidth: 1,
    flexDirection: "column",
  },
  drawerHeader: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLogoText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  brandSubtitle: {
    fontSize: 11,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuScroll: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  planBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  creditsText: {
    fontSize: 11,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  roleGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  roleCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 4,
  },
  roleCardText: {
    fontSize: 12,
    fontWeight: "700",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
