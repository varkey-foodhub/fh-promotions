import { AppToastConfig } from "@/src/components/ui/AppToast";
import { queryClient } from "@/src/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const toastConfig = AppToastConfig();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ Auto theme status bar */}
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(manager)" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
      </Stack>

      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
