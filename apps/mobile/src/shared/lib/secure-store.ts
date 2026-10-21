// apps/mobile/src/shared/lib/secure-store.ts
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "master_auth_token",
  REFRESH_TOKEN: "master_refresh_token",
  ACTIVE_ROLE: "master_active_role",
  ACTIVE_WORKSPACE_ID: "master_workspace_id",
  BIOMETRIC_ENABLED: "master_biometric_enabled",
  USER_DATA: "master_user_profile",
} as const;

export class SecureStoreManager {
  /**
   * Save item to encrypted hardware keychain/keystore
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      });
    } catch (error) {
      console.warn(`[SecureStoreManager] Error saving ${key}:`, error);
    }
  }

  /**
   * Retrieve item from encrypted storage
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStoreManager] Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStoreManager] Error removing ${key}:`, error);
    }
  }

  /**
   * Check if device supports FaceID / Fingerprint biometrics
   */
  static async checkBiometricCapability(): Promise<{
    hasHardware: boolean;
    isEnrolled: boolean;
    biometricTypes: LocalAuthentication.AuthenticationType[];
  }> {
    if (Platform.OS === "web") {
      return { hasHardware: false, isEnrolled: false, biometricTypes: [] };
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return { hasHardware, isEnrolled, biometricTypes };
  }

  /**
   * Prompt biometric authentication (Face ID / Fingerprint)
   */
  static async authenticateWithBiometrics(
    promptMessage = "Authenticate with Face ID / Fingerprint to proceed"
  ): Promise<{ success: boolean; error?: string }> {
    if (Platform.OS === "web") {
      return { success: true };
    }

    try {
      const capability = await this.checkBiometricCapability();
      if (!capability.hasHardware || !capability.isEnrolled) {
        return { success: false, error: "Biometrics not available or not enrolled on this device" };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Enter App Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || "Biometric authentication failed" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      return { success: false, error: msg };
    }
  }

  /**
   * Clear all auth session tokens
   */
  static async clearSession(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      this.removeItem(STORAGE_KEYS.ACTIVE_ROLE),
      this.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  }
}
