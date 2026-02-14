import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreatePromotionForm from "./CreatePromotionForm";

type Props = {};

const CreatePromotionsPage = (props: Props) => {
  const colors = useThemeColor();
  const router = useRouter();

  const handler = {
    navigateBack: () => {
      router.back();
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#D32F2F", "#C62828"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={handler.navigateBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <ThemedText variant="title" style={styles.headerTitle}>
              Create Promotion
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Fill in the details below
            </ThemedText>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* Form Card */}
      <View style={styles.formWrapper}>
        <View
          style={[
            styles.formCard,
            { backgroundColor: colors.backgroundElevated },
          ]}
        >
          <CreatePromotionForm />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePromotionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginBottom:30
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.85,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
});