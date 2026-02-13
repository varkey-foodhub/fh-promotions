import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View
        style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}
      >
        <TouchableOpacity onPress={handler.navigateBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20, color: "#471913" }}>
          Create New Promotion
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.formCard}>
        <CreatePromotionForm />
      </View>
    </SafeAreaView>
  );
};

export default CreatePromotionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formCard: {
    backgroundColor: "white",
    margin: 8,
    borderRadius: 8,
    height: "100%",
  },
});
