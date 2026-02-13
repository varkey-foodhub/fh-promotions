import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Success = () => {
  const colors = useThemeColor();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/menu");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require("@/assets/animations/success.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          🎉 Order Placed!
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your food is being prepared.
        </Text>

        <Text style={[styles.caption, { color: colors.textSecondary }]}>
          Sit tight. Deliciousness is on the way 🚀
        </Text>

        <Text style={[styles.redirect, { color: colors.textSecondary }]}>
          Redirecting you back...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 12,
  },
  animationContainer: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  caption: {
    fontSize: 14,
    textAlign: "center",
  },
  redirect: {
    marginTop: 20,
    fontSize: 12,
    opacity: 0.6,
  },
});
