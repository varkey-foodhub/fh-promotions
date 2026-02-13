import { Stack } from "expo-router";

export default function ManagerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal / Push screens */}
      <Stack.Screen name="createPromotion" />
    </Stack>
  );
}
