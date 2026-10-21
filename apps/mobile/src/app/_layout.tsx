// apps/mobile/src/app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useThemeStore } from "@/shared/stores/theme.store";
import "../global.css";

export default function RootLayout() {
  const { initializeAuth } = useAuthStore();
  const { initializeTheme, isDark } = useThemeStore();

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, [initializeAuth, initializeTheme]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="chat/index"
            options={{
              presentation: "card",
              headerShown: false,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
