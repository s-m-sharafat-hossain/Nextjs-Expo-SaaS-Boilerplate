// apps/mobile/src/features/portals/super-admin-portal/super-admin.screen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  FileText,
  UserX,
  UserCheck,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useSuperAdminController, SuperAdminTab } from "./super-admin.controller";
import { useThemeStore } from "@/shared/stores/theme.store";

export const SuperAdminPortalScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    activeTab,
    setActiveTab,
    data,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadData,
    toggleMaintenanceMode,
    toggleRegistration,
    manageAdmin,
  } = useSuperAdminController();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: isDark ? "#111827" : "#ffffff",
      borderRadius: 12,
      padding: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e2e8f0",
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
    },
    activeTabButton: {
      backgroundColor: "#9333ea",
    },
    tabText: {
      fontSize: 12,
      fontWeight: "600",
      color: isDark ? "#94a3b8" : "#64748b",
    },
    activeTabText: {
      color: "#ffffff",
    },
    card: {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e2e8f0",
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: isDark ? "#f8fafc" : "#0f172a",
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 11,
      color: isDark ? "#94a3b8" : "#64748b",
      marginBottom: 12,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#1f2937" : "#f1f5f9",
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? "#94a3b8" : "#64748b",
    },
    statValue: {
      fontSize: 14,
      fontWeight: "700",
      color: isDark ? "#f8fafc" : "#0f172a",
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      marginTop: 8,
    },
    actionBtnText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 6,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      fontSize: 10,
      fontWeight: "700",
    },
    alertBanner: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      marginBottom: 14,
      backgroundColor: isDark ? "#3b1e08" : "#fffbeb",
      borderColor: "#f59e0b",
      borderWidth: 1,
    },
    alertText: {
      fontSize: 12,
      color: "#d97706",
      marginLeft: 8,
      flex: 1,
      fontWeight: "600",
    },
  });

  return (
    <StandardMobileScreenShell
      title="Super Admin Governance"
      subtitle="Apex Root Platform Authority"
      isLoading={isLoading}
      onRefresh={loadData}
    >
      {/* Maintenance Mode Warning */}
      {data?.settings?.maintenanceMode && (
        <View style={styles.alertBanner}>
          <AlertTriangle size={16} color="#d97706" />
          <Text style={styles.alertText}>
            Maintenance Mode is active. Normal users restricted.
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(["metrics", "settings", "admins", "audit"] as SuperAdminTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TAB: METRICS */}
      {activeTab === "metrics" && data && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Platform Overview</Text>
            <Text style={styles.cardSubtitle}>Real-time system health and volume</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Gross Payment Volume</Text>
              <Text style={styles.statValue}>${data.stats.grossVolume.toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Platform Fee Income</Text>
              <Text style={[styles.statValue, { color: "#10b981" }]}>
                ${data.stats.estimatedPlatformFees.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Users</Text>
              <Text style={styles.statValue}>{data.stats.totalUsers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Super Admins / Admins</Text>
              <Text style={styles.statValue}>
                {data.stats.superAdminsCount} / {data.stats.adminsCount}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Workspaces</Text>
              <Text style={styles.statValue}>{data.stats.totalWorkspaces}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active Sessions</Text>
              <Text style={styles.statValue}>{data.stats.activeSessionsCount}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* TAB: SETTINGS */}
      {activeTab === "settings" && data && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Emergency Controls</Text>
            <Text style={styles.cardSubtitle}>Platform availability switches</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Maintenance Mode</Text>
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: data.settings.maintenanceMode ? "#fee2e2" : "#dcfce7",
                    color: data.settings.maintenanceMode ? "#b91c1c" : "#15803d",
                  },
                ]}
              >
                {data.settings.maintenanceMode ? "ENABLED" : "DISABLED"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: data.settings.maintenanceMode ? "#10b981" : "#f43f5e" },
              ]}
              onPress={toggleMaintenanceMode}
              disabled={isSubmitting}
            >
              {data.settings.maintenanceMode ? (
                <>
                  <Unlock size={14} color="#fff" />
                  <Text style={styles.actionBtnText}>Disable Maintenance Mode</Text>
                </>
              ) : (
                <>
                  <Lock size={14} color="#fff" />
                  <Text style={styles.actionBtnText}>Enable Maintenance Mode</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={[styles.statRow, { marginTop: 16 }]}>
              <Text style={styles.statLabel}>User Registration</Text>
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: data.settings.registrationEnabled ? "#dcfce7" : "#fef3c7",
                    color: data.settings.registrationEnabled ? "#15803d" : "#b45309",
                  },
                ]}
              >
                {data.settings.registrationEnabled ? "OPEN" : "LOCKED"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#6366f1" }]}
              onPress={toggleRegistration}
              disabled={isSubmitting}
            >
              <Text style={styles.actionBtnText}>
                {data.settings.registrationEnabled ? "Lock Registrations" : "Open Registrations"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Global Parameters</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Platform Name</Text>
              <Text style={styles.statValue}>{data.settings.platformName}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Default Plan</Text>
              <Text style={styles.statValue}>{data.settings.defaultPlan}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Platform Fee</Text>
              <Text style={styles.statValue}>{data.settings.platformFeePercent}%</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Min Payout</Text>
              <Text style={styles.statValue}>${data.settings.minPayoutAmount}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* TAB: ADMINS */}
      {activeTab === "admins" && data && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.admins.map((admin) => (
            <View key={admin.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.cardTitle}>{admin.name}</Text>
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: admin.role === "SUPER_ADMIN" ? "#f3e8ff" : "#e0e7ff",
                      color: admin.role === "SUPER_ADMIN" ? "#7e22ce" : "#4338ca",
                    },
                  ]}
                >
                  {admin.role}
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>{admin.email}</Text>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Credits</Text>
                <Text style={styles.statValue}>{admin.credits}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Account Status</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: admin.isBanned ? "#ef4444" : "#10b981" }}>
                  {admin.isBanned ? "Suspended" : "Active"}
                </Text>
              </View>

              {admin.role !== "SUPER_ADMIN" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { flex: 1, backgroundColor: "#6366f1", marginTop: 0 }]}
                    onPress={() => manageAdmin(admin.id, "ADJUST_CREDITS", 100)}
                  >
                    <Text style={styles.actionBtnText}>+100 Credits</Text>
                  </TouchableOpacity>
                  {admin.isBanned ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 1, backgroundColor: "#10b981", marginTop: 0 }]}
                      onPress={() => manageAdmin(admin.id, "ACTIVATE")}
                    >
                      <Text style={styles.actionBtnText}>Activate</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionBtn, { flex: 1, backgroundColor: "#f59e0b", marginTop: 0 }]}
                      onPress={() => manageAdmin(admin.id, "SUSPEND")}
                    >
                      <Text style={styles.actionBtnText}>Suspend</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* TAB: AUDIT */}
      {activeTab === "audit" && data && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.recentLogs.map((log) => (
            <View key={log.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.cardTitle, { color: "#9333ea" }]}>{log.action}</Text>
                <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                  {new Date(log.createdAt).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>
                Entity: {log.entity} | Actor: {log.user?.email || "System"}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </StandardMobileScreenShell>
  );
};
