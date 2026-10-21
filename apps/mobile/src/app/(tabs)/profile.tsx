// apps/mobile/src/app/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Fingerprint,
  Moon,
  Sun,
  Shield,
  Briefcase,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Globe,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useThemeStore } from "@/shared/stores/theme.store";
import { appConfig, RoleType } from "@shared/config";
import { themeConfig } from "@shared/config";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, activeRole, switchRole, logout, biometricEnabled, setBiometricEnabled } = useAuthStore();
  const { mode, isDark, setMode, colors } = useThemeStore();

  const handleToggleBiometric = async (value: boolean) => {
    await setBiometricEnabled(value);
    Alert.alert(
      "Biometric Security",
      value
        ? "Face ID / Fingerprint lock is now ENABLED for sensitive actions."
        : "Biometric lock disabled."
    );
  };

  const handleRoleSwitch = async (role: RoleType) => {
    await switchRole(role);
    Alert.alert("Active Role Switched", `Switched to ${role} Portal view.`);
  };

  return (
    <StandardMobileScreenShell
      title="Profile & Settings"
      subtitle="Security, Biometrics & Preferences"
    >
      {/* User Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Image
          source={{
            uri:
              user?.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
          }}
          style={styles.avatar}
        />
        <View style={styles.profileDetails}>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            {user?.name || "Demo User"}
          </Text>
          <Text style={[styles.emailText, { color: colors.textSecondary }]}>
            {user?.email || "user@demo.com"}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.kycBadge,
                { backgroundColor: `${themeConfig.colors.status.success}20` },
              ]}
            >
              <ShieldCheck size={12} color={themeConfig.colors.status.success} />
              <Text
                style={[
                  styles.kycBadgeText,
                  { color: themeConfig.colors.status.success },
                ]}
              >
                VERIFIED KYC
              </Text>
            </View>

            <View
              style={[
                styles.roleBadge,
                { backgroundColor: `${themeConfig.colors.primary[500]}20` },
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: themeConfig.colors.primary[500] },
                ]}
              >
                {activeRole}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* QUICK ROLE SWITCHER FOR DEMO/TESTING */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
        ROLE PORTAL SWITCHER
      </Text>
      <View style={styles.roleGrid}>
        {(["ADMIN", "PROVIDER", "CONSUMER"] as RoleType[]).map((r) => {
          const isActive = activeRole === r;
          const badgeColor =
            r === "ADMIN"
              ? appConfig.roleLabels.admin.badgeColor
              : r === "PROVIDER"
              ? appConfig.roleLabels.provider.badgeColor
              : appConfig.roleLabels.consumer.badgeColor;

          return (
            <TouchableOpacity
              key={r}
              onPress={() => handleRoleSwitch(r)}
              style={[
                styles.roleBtn,
                {
                  borderColor: isActive ? badgeColor : colors.border,
                  backgroundColor: isActive ? `${badgeColor}15` : colors.card,
                },
              ]}
            >
              {r === "ADMIN" ? (
                <Shield size={16} color={badgeColor} />
              ) : r === "PROVIDER" ? (
                <Briefcase size={16} color={badgeColor} />
              ) : (
                <User size={16} color={badgeColor} />
              )}
              <Text
                style={[
                  styles.roleBtnText,
                  { color: isActive ? badgeColor : colors.textPrimary },
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SECURITY & BIOMETRICS */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted, marginTop: 14 }]}>
        SECURITY & HARDWARE LOCK
      </Text>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLabelRow}>
            <Fingerprint size={20} color={themeConfig.colors.primary[500]} />
            <View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Face ID / Biometric Lock
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Require biometrics for sensitive wallet payouts
              </Text>
            </View>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={handleToggleBiometric}
            trackColor={{ false: "#64748b", true: themeConfig.colors.primary[500] }}
          />
        </View>
      </View>

      {/* APPEARANCE & THEME */}
      <Text style={[styles.sectionHeading, { color: colors.textMuted, marginTop: 14 }]}>
        APPEARANCE & THEME
      </Text>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLabelRow}>
            {isDark ? (
              <Moon size={20} color={themeConfig.colors.primary[400]} />
            ) : (
              <Sun size={20} color="#f59e0b" />
            )}
            <View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Dark Appearance
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Currently: {mode.toUpperCase()} mode
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={(val) => setMode(val ? "dark" : "light")}
            trackColor={{ false: "#64748b", true: themeConfig.colors.primary[500] }}
          />
        </View>

        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 12, paddingTop: 12 }]}>
          <View style={styles.settingLabelRow}>
            <Globe size={20} color={colors.textSecondary} />
            <View>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
                Region & Language
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                English (US) • USD ($)
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
      </View>

      {/* SIGN OUT */}
      <TouchableOpacity
        onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}
        style={[
          styles.logoutButton,
          {
            backgroundColor: `${themeConfig.colors.status.danger}15`,
            borderColor: `${themeConfig.colors.status.danger}40`,
          },
        ]}
      >
        <LogOut size={18} color={themeConfig.colors.status.danger} />
        <Text style={[styles.logoutText, { color: themeConfig.colors.status.danger }]}>
          Sign Out of Mobile Session
        </Text>
      </TouchableOpacity>
    </StandardMobileScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "700",
  },
  emailText: {
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  kycBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  kycBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  roleGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  settingsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 30,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
