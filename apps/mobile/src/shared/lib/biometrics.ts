// apps/mobile/src/shared/lib/biometrics.ts
import { SecureStoreManager, STORAGE_KEYS } from "./secure-store";
import { ApiClient } from "./api-client";
import { Platform } from "react-native";

export class MobileBiometricService {
  /**
   * Check if the device hardware supports biometrics and has enrolled fingerprints or Face ID
   */
  static async isAvailable(): Promise<boolean> {
    const capability = await SecureStoreManager.checkBiometricCapability();
    return capability.hasHardware && capability.isEnrolled;
  }

  /**
   * Enroll device biometrics with local secure store and backend
   */
  static async enrollBiometrics(userId: string): Promise<{ success: boolean; error?: string }> {
    if (Platform.OS === "web") {
      return { success: false, error: "Biometrics not supported on web" };
    }

    const available = await this.isAvailable();
    if (!available) {
      return { success: false, error: "Biometric hardware unavailable or not enrolled on device" };
    }

    const authResult = await SecureStoreManager.authenticateWithBiometrics(
      "Confirm your Face ID / Fingerprint to enable biometric login"
    );

    if (!authResult.success) {
      return { success: false, error: authResult.error || "Biometric authentication failed" };
    }

    try {
      const syntheticCredentialId = `bio_${userId}_${Date.now()}`;
      const syntheticPublicKey = `pub_${Math.random().toString(36).slice(2)}`;

      await ApiClient.post("/auth/biometric/enroll", {
        credentialId: syntheticCredentialId,
        publicKey: syntheticPublicKey,
        deviceName: `${Platform.OS.toUpperCase()} Device`,
      });

      await SecureStoreManager.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, "true");
      await SecureStoreManager.setItem("biometric_credential_id", syntheticCredentialId);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to register biometric credential" };
    }
  }

  /**
   * Verify biometrics on login and retrieve authenticated session
   */
  static async verifyBiometrics(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const authResult = await SecureStoreManager.authenticateWithBiometrics(
      "Log in securely with Face ID / Fingerprint"
    );

    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    try {
      const res = await ApiClient.post<any>("/auth/biometric/verify", {
        userId,
      });

      return { success: true, data: res };
    } catch (err: any) {
      return { success: false, error: err?.message || "Biometric verification failed" };
    }
  }
}
