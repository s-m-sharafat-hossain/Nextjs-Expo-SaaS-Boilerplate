// apps/mobile/src/shared/stores/theme.store.ts
import { create } from "zustand";
import { Appearance } from "react-native";
import { SecureStoreManager } from "../lib/secure-store";
import { themeConfig } from "@shared/config";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof themeConfig.colors.dark | typeof themeConfig.colors.light;
  setMode: (mode: ThemeMode) => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set: any, get: any) => ({
  mode: "dark",
  isDark: true,
  colors: themeConfig.colors.dark,

  initializeTheme: async () => {
    const saved = await SecureStoreManager.getItem("master_app_theme");
    const mode = (saved as ThemeMode) || "dark";
    const systemScheme = Appearance.getColorScheme();
    const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

    set({
      mode,
      isDark,
      colors: isDark ? themeConfig.colors.dark : themeConfig.colors.light,
    });
  },

  setMode: async (mode: ThemeMode) => {
    await SecureStoreManager.setItem("master_app_theme", mode);
    const systemScheme = Appearance.getColorScheme();
    const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

    set({
      mode,
      isDark,
      colors: isDark ? themeConfig.colors.dark : themeConfig.colors.light,
    });
  },
}));
