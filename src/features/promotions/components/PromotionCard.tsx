import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Promotion } from "../promotions.types";

interface Props {
  item: Promotion;
  onDelete: (id: number) => void;
}

export const PromotionCard = ({ item, onDelete }: Props) => {
  const colors = useThemeColor();

  const getValueText = () => {
    if (item.type === "PERCENTAGE") return `${item.percent_off}% OFF`;
    if (item.type === "FIXED") return `Flat $${item.flat_amount}`;
    return "Bundle Deal";
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundElevated }]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <ThemedText variant="subtitle" style={styles.title}>
          {item.name}
        </ThemedText>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="trash-2" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Divider Spacing */}
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Code
          </Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {item.code}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Value
          </Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {getValueText()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export { Promotion } from "../promotions.types";
const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  metaContainer: {
    gap: 8,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },
});
