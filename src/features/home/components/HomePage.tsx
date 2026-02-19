// app/(tabs)/index.tsx
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Href, useRouter } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function HomePage() {
  const colors = useThemeColor();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const menuScale = useRef(new Animated.Value(1)).current;
  const managerScale = useRef(new Animated.Value(1)).current;

  const animateScale = (value: Animated.Value, toValue: number) => {
    if (!isWeb) {
      return;
    }
    Animated.timing(value, {
      toValue,
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

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
          style={[
            styles.headerTitle,
            { fontSize: 30, color: colors.textAccentCO },
          ]}
        >
          FoodHub
        </ThemedText>
        <ThemedText
          variant="subtitle"
          style={[
            styles.headerSubtitle,
            { color: colors.textTertiary, marginTop: 8 },
          ]}
        >
          Welcome back. Select a portal.
        </ThemedText>
      </View>

      <View style={styles.sectionLabel}>
        <ThemedText
          variant="caption"
          style={[styles.sectionLabelText, { color: colors.textSecondary }]}
        >
          Quick Redirect
        </ThemedText>
      </View>

      {/* 2. Action Cards */}
      <View
        style={[styles.actionContainer, isWeb && styles.actionContainerWeb]}
      >
        {/* Primary Card: CUSTOMER MENU (Brand Red) */}
        <AnimatedTouchableOpacity
          style={[
            styles.card,
            styles.cardPrimary,
            isWeb && styles.cardWeb,
            isWeb && styles.cardPrimaryWeb,
            { transform: [{ scale: menuScale }] },
            {
              backgroundColor: colors.backgroundAccentCO,
              shadowColor: colors.accentCO, // Glow effect
            },
          ]}
          activeOpacity={0.9}
          onPress={() => handleNavigate("/menu")}
        >
          <View style={styles.cardContent}>
            <ThemedText
              variant="title"
              style={[styles.cardTitle, { color: colors.textInverse }]}
            >
              View Menu
            </ThemedText>
            <ThemedText
              variant="caption"
              style={[
                styles.cardSubtitle,
                { color: colors.textInverse, opacity: 0.8, marginTop: 4 },
              ]}
            >
              Browse food & place orders
            </ThemedText>
          </View>
        </AnimatedTouchableOpacity>

        {/* Secondary Card: MANAGER (Neutral Surface) */}
        <AnimatedTouchableOpacity
          style={[
            styles.card,
            isWeb && styles.cardWeb,
            { transform: [{ scale: managerScale }] },
            { backgroundColor: colors.backgroundSecondary },
          ]}
          activeOpacity={0.7}
          onPress={() => handleNavigate("/(manager)/(tabs)")}
        >
          <View style={styles.cardContent}>
            <ThemedText
              variant="subtitle"
              style={[styles.cardTitle, { color: colors.textPrimary }]}
            >
              Manager Portal
            </ThemedText>
            <ThemedText
              variant="caption"
              style={[
                styles.cardSubtitle,
                { color: colors.textSecondary, marginTop: 4 },
              ]}
            >
              Update menu, items & settings
            </ThemedText>
          </View>
        </AnimatedTouchableOpacity>
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
    alignItems: "center",
  },
  headerTitle: {
    textAlign: "center",
  },
  headerSubtitle: {
    textAlign: "center",
  },
  sectionLabel: {
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabelText: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  actionContainer: {
    flex: 1,
    gap: 20, // Space between cards
  },
  actionContainerWeb: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
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
  cardWeb: {
    flexGrow: 0,
    flexShrink: 1,
    width: 220,
    height: 220,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  cardPrimaryWeb: {
    paddingVertical: 22,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    textAlign: "center",
  },
  cardSubtitle: {
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
