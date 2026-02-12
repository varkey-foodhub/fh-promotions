// app/(tabs)/index.tsx
import { ThemedText } from "@/components/themed/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColors";
import { Href, useRouter } from "expo-router";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

export default function HomePage() {
  const colors = useThemeColor();
  const router = useRouter();
  const handlers = {
    navigate: (path: Href) => {
      router.navigate(path);
    },
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={styles.centerContent}>
        {/* Logo */}
        <View style={styles.logo}>
          <ThemedText
            style={{ color: colors.buttonPrimaryText }}
            variant="title"
          >
            FoodHub
          </ThemedText>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.buttonPrimaryText },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              handlers.navigate("/(manager)");
            }}
          >
            <ThemedText variant="subtitle" style={{ color: colors.primary }}>
              Manage Menu
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.buttonPrimaryText },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              handlers.navigate("/menu");
            }}
          >
            <ThemedText variant="subtitle" style={{ color: colors.primary }}>
              View Menu
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BUTTON_SIZE = width * 0.4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    paddingVertical: 50,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 24,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 32, // squircle feel
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
