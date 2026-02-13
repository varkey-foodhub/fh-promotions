import { useThemeColor } from "@/src/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons"; // Standard icon set in Expo
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const colors = useThemeColor();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // 1. Brand Colors
        tabBarActiveTintColor: colors.accentCO, // Red for active
        tabBarInactiveTintColor: colors.textLight, // Gray for inactive

        // 2. The Bar Style
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated, // Clean background
          borderTopColor: colors.borderLight, // Subtle separator
          borderTopWidth: 1,
          // Remove native elevation shadow on Android for a cleaner look
          elevation: 0,
          shadowOpacity: 0,
        },

        // 3. Text Style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Promotions" // Make sure this matches your file name exactly!
        options={{
          title: "Promos", // "Explore" is generic; "Promos" fits the file name
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "pricetag" : "pricetag-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
