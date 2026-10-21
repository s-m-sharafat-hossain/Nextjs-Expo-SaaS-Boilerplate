// apps/mobile/src/shared/stores/auth.store.ts
import { create } from "zustand";
import { SecureStoreManager, STORAGE_KEYS } from "../lib/secure-store";
import { ApiClient } from "../lib/api-client";
import { RoleType } from "@shared/config";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  plan?: string;
  credits?: number;
  image?: string | null;
  phone?: string | null;
  kycStatus?: string;
  wallet?: {
    balance: number;
    pendingBalance: number;
    currency: string;
  };
}

interface AuthState {
  user: UserProfile | null;
  activeRole: RoleType;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  setUser: (user: UserProfile | null, token?: string) => Promise<void>;
  switchRole: (role: RoleType) => Promise<void>;
  demoLogin: (role: RoleType) => Promise<void>;
  logout: () => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
  user: null,
  activeRole: "CONSUMER",
  token: null,
  isAuthenticated: false,
  isLoading: true,
  biometricEnabled: false,

  /**
   * Hydrate state from SecureStore on app cold launch
   */
  initializeAuth: async () => {
    try {
      const [token, savedRole, savedUserJson, biometricFlag] = await Promise.all([
        SecureStoreManager.getItem(STORAGE_KEYS.AUTH_TOKEN),
        SecureStoreManager.getItem(STORAGE_KEYS.ACTIVE_ROLE),
        SecureStoreManager.getItem(STORAGE_KEYS.USER_DATA),
        SecureStoreManager.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
      ]);

      const user = savedUserJson ? JSON.parse(savedUserJson) : null;
      const role = (savedRole as RoleType) || user?.role || "CONSUMER";

      set({
        token,
        user,
        activeRole: role,
        isAuthenticated: !!token && !!user,
        biometricEnabled: biometricFlag === "true",
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  /**
   * Set user profile and auth token
   */
  setUser: async (user: UserProfile | null, token?: string) => {
    if (token) {
      await SecureStoreManager.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
    if (user) {
      await Promise.all([
        SecureStoreManager.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
        SecureStoreManager.setItem(STORAGE_KEYS.ACTIVE_ROLE, user.role),
      ]);
    }
    set({
      user,
      activeRole: user?.role || get().activeRole,
      token: token || get().token,
      isAuthenticated: !!user,
    });
  },

  /**
   * 1-Click Role Switcher
   */
  switchRole: async (role: RoleType) => {
    await SecureStoreManager.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    set({ activeRole: role });
  },

  /**
   * 1-Click Portfolio Demo Login
   */
  demoLogin: async (role: RoleType) => {
    set({ isLoading: true });
    try {
      const result = await ApiClient.post<{ user: UserProfile; redirectPath: string }>("/auth/demo", {
        role,
      });

      // Synthetic demo token
      const demoToken = `demo_token_${role.toLowerCase()}_${Date.now()}`;
      await get().setUser(result.user, demoToken);
      await get().switchRole(role);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Logout and clear encrypted session
   */
  logout: async () => {
    await SecureStoreManager.clearSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      activeRole: "CONSUMER",
    });
  },

  /**
   * Toggle biometric lock setting
   */
  setBiometricEnabled: async (enabled: boolean) => {
    await SecureStoreManager.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, String(enabled));
    set({ biometricEnabled: enabled });
  },
}));
