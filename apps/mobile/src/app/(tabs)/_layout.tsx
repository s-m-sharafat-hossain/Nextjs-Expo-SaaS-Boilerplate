// apps/mobile/src/app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  LayoutDashboard,
  Calendar,
  Compass,
  CreditCard,
  User,
  Menu,
} from "lucide-react-native";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useThemeStore } from "@/shared/stores/theme.store";
import { ResponsiveSidebarDrawer } from "@/shared/layouts/ResponsiveSidebarDrawer";
import { themeConfig } from "@shared/config";

export default function TabsLayout() {
  const { activeRole } = useAuthStore();
  const { colors } = useThemeStore();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Dynamic label based on active portal
  const exploreLabel =
    activeRole === "SUPER_ADMIN"
      ? "Governance"
      : activeRole === "ADMIN"
      ? "Users & KYC"
      : activeRole === "PROVIDER"
      ? "Services"
      : "Explore";

  const bookingsLabel =
    activeRole === "SUPER_ADMIN"
      ? "Audit Trail"
      : activeRole === "ADMIN"
      ? "Disputes"
      : activeRole === "PROVIDER"
      ? "Orders"
      : "Bookings";

  const walletLabel =
    activeRole === "SUPER_ADMIN"
      ? "Treasury"
      : activeRole === "ADMIN"
      ? "Payouts"
      : activeRole === "PROVIDER"
      ? "Earnings"
      : "Wallet";

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: themeConfig.colors.primary[500],
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.tabBarBackground,
              borderTopColor: colors.border,
            },
          ],
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={size || 22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: exploreLabel,
            tabBarIcon: ({ color, size }) => (
              <Compass size={size || 22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="bookings"
          options={{
            title: bookingsLabel,
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size || 22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="wallet"
          options={{
            title: walletLabel,
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={size || 22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User size={size || 22} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setDrawerVisible(true)}
                style={styles.headerDrawerBtn}
              >
                <Menu size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      {/* Global Responsive Sidebar Drawer Trigger */}
      <ResponsiveSidebarDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  headerDrawerBtn: {
    marginRight: 16,
  },
});
