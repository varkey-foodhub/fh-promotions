// app/(tabs)/index.tsx
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Href, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const colors = useThemeColor();
  const router = useRouter();

  const handleNavigate = (path: Href) => {
    router.push(path);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      {/* 1. Header Section */}
      <View style={styles.header}>
        <ThemedText
          variant="title"
          style={{ fontSize: 40, color: colors.textAccentCO }}
        >
          FoodHub
        </ThemedText>
        <ThemedText
          variant="subtitle"
          style={{ color: colors.textTertiary, marginTop: 8 }}
        >
          Welcome back. Select a portal.
        </ThemedText>
      </View>

      {/* 2. Action Cards */}
      <View style={styles.actionContainer}>
        {/* Primary Card: CUSTOMER MENU (Brand Red) */}
        <TouchableOpacity
          style={[
            styles.card,
            styles.cardPrimary,
            {
              backgroundColor: colors.backgroundAccentCO,
              shadowColor: colors.accentCO, // Glow effect
            },
          ]}
          activeOpacity={0.9}
          onPress={() => handleNavigate("/menu")}
        >
          <View style={styles.cardContent}>
            <ThemedText variant="title" style={{ color: colors.textInverse }}>
              View Menu
            </ThemedText>
            <ThemedText
              variant="caption"
              style={{ color: colors.textInverse, opacity: 0.8, marginTop: 4 }}
            >
              Browse food & place orders
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Secondary Card: MANAGER (Neutral Surface) */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}
          activeOpacity={0.7}
          onPress={() => handleNavigate("/(manager)")}
        >
          <View style={styles.cardContent}>
            <ThemedText
              variant="subtitle"
              style={{ color: colors.textPrimary }}
            >
              Manager Portal
            </ThemedText>
            <ThemedText
              variant="caption"
              style={{ color: colors.textSecondary, marginTop: 4 }}
            >
              Update menu, items & settings
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. Footer / Version info (Optional filler) */}
      <View style={styles.footer}>
        <ThemedText variant="caption" style={{ color: colors.textLight }}>
          FoodHub Promotions Prototype
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  actionContainer: {
    flex: 1,
    gap: 20, // Space between cards
  },
  card: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    justifyContent: "center",
    // Base Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardPrimary: {
    // Make the primary card slightly taller/dominant
    paddingVertical: 40,
    shadowOpacity: 0.3,
    elevation: 10,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
