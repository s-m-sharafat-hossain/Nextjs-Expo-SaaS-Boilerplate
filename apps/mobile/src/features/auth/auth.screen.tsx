import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Fingerprint,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
} from "lucide-react-native";
import { useAuthController } from "./auth.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";
import { RoleType } from "./auth.schema";

export const AuthScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    selectedRole,
    setSelectedRole,
    termsAccepted,
    setTermsAccepted,
    isLoading,
    error,
    fieldErrors,
    handleLogin,
    handleRegister,
    handleBiometricAuth,
    handleDemoLogin,
  } = useAuthController();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Banner */}
        <View style={styles.brandHeader}>
          <View
            style={[
              styles.logoIconBox,
              { backgroundColor: themeConfig.colors.primary[500] },
            ]}
          >
            <ShieldCheck size={32} color="#ffffff" />
          </View>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            Master SaaS Mobile
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Enterprise Multi-Role Marketplace & Platform
          </Text>
        </View>

        {/* 1-Click Demo Switcher Strip */}
        <View style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.demoTitleRow}>
            <Sparkles size={16} color={themeConfig.colors.primary[500]} />
            <Text style={[styles.demoTitle, { color: colors.textPrimary }]}>
              1-Click Demo Fast Login
            </Text>
          </View>
          <Text style={[styles.demoDesc, { color: colors.textSecondary }]}>
            Instantly explore any portal without typing credentials:
          </Text>

          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoRoleBtn, { backgroundColor: `${themeConfig.colors.primary[500]}15` }]}
              onPress={() => handleDemoLogin("ADMIN")}
              activeOpacity={0.7}
            >
              <ShieldCheck size={14} color={themeConfig.colors.primary[500]} />
              <Text style={[styles.demoRoleBtnText, { color: themeConfig.colors.primary[500] }]}>
                Admin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoRoleBtn, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}
              onPress={() => handleDemoLogin("PROVIDER")}
              activeOpacity={0.7}
            >
              <Briefcase size={14} color="#10b981" />
              <Text style={[styles.demoRoleBtnText, { color: "#10b981" }]}>
                Provider
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoRoleBtn, { backgroundColor: "rgba(14, 165, 233, 0.15)" }]}
              onPress={() => handleDemoLogin("CONSUMER")}
              activeOpacity={0.7}
            >
              <Users size={14} color="#0ea5e9" />
              <Text style={[styles.demoRoleBtnText, { color: "#0ea5e9" }]}>
                Consumer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs: Login / Register */}
        <View style={[styles.tabSelector, { backgroundColor: colors.cardSubtle }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              mode === "LOGIN" && [styles.tabButtonActive, { backgroundColor: colors.card }],
            ]}
            onPress={() => setMode("LOGIN")}
          >
            <Text
              style={[
                styles.tabText,
                { color: mode === "LOGIN" ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              mode === "REGISTER" && [styles.tabButtonActive, { backgroundColor: colors.card }],
            ]}
            onPress={() => setMode("REGISTER")}
          >
            <Text
              style={[
                styles.tabText,
                { color: mode === "REGISTER" ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Notification */}
        {error && (
          <View style={styles.errorBox}>
            <AlertCircle size={18} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Register Only: Name Input */}
        {mode === "REGISTER" && (
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: fieldErrors.name ? "#ef4444" : colors.border }]}>
              <User size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="Dr. Sarah Mitchell"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            {fieldErrors.name && <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>}
          </View>
        )}

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: fieldErrors.email ? "#ef4444" : colors.border }]}>
            <Mail size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              placeholder="user@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {fieldErrors.email && <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: fieldErrors.password ? "#ef4444" : colors.border }]}>
            <Lock size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {fieldErrors.password && <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>}
        </View>

        {/* Register Only: Role Selection Pills */}
        {mode === "REGISTER" && (
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Account Role</Text>
            <View style={styles.roleSelectionRow}>
              {(["CONSUMER", "PROVIDER"] as RoleType[]).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.rolePill,
                    {
                      backgroundColor: selectedRole === role ? themeConfig.colors.primary[500] : colors.card,
                      borderColor: selectedRole === role ? themeConfig.colors.primary[500] : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text
                    style={[
                      styles.rolePillText,
                      { color: selectedRole === role ? "#ffffff" : colors.textPrimary },
                    ]}
                  >
                    {role === "CONSUMER" ? "Client / Consumer" : "Vendor / Provider"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: themeConfig.colors.primary[500] },
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={mode === "LOGIN" ? handleLogin : handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.submitRow}>
              <Text style={styles.submitButtonText}>
                {mode === "LOGIN" ? "Sign In to Portal" : "Complete Registration"}
              </Text>
              <ArrowRight size={18} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Biometric Face ID / Fingerprint Button */}
        <TouchableOpacity
          style={[
            styles.biometricButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleBiometricAuth}
          activeOpacity={0.8}
        >
          <Fingerprint size={22} color={themeConfig.colors.primary[500]} />
          <Text style={[styles.biometricButtonText, { color: colors.textPrimary }]}>
            Sign In with Face ID / Fingerprint
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: themeConfig.colors.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  demoCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  demoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  demoDesc: {
    fontSize: 12,
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  demoRoleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  demoRoleBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tabSelector: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
  },
  fieldErrorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  roleSelectionRow: {
    flexDirection: "row",
    gap: 10,
  },
  rolePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  biometricButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
