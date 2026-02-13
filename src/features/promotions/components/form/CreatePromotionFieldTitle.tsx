import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
type Props = {
  text: string;
};

const CreatePromotionFieldTitle = ({ text }: Props) => {
  const colors = useThemeColor();
  return (
    <View style={styles.labelRow}>
      <ThemedText style={styles.fieldTitle}>{text}</ThemedText>
      <Text
        style={[styles.asterisk, { color: colors.actionNegative ?? "red" }]}
      >
        *
      </Text>
    </View>
  );
};

export default CreatePromotionFieldTitle;

const styles = StyleSheet.create({
  fieldTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },

  asterisk: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
});
