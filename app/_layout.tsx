import { AppToastConfig } from "@/src/components/ui/AppToast";
import { queryClient } from "@/src/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const toastConfig = AppToastConfig(); // ✅ inside component

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(manager)" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
      </Stack>

      {/* Always mount AFTER navigation */}
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
