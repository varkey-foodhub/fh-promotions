import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { type Promotion } from "../promotions.types";

interface Props {
  item: Promotion;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, currentValue: boolean) => void;
}

export const PromotionCard = ({ item, onDelete, onToggleActive }: Props) => {
  const colors = useThemeColor();

  // --- Logic ---
  const isExpired = item.valid_to
    ? new Date(item.valid_to) < new Date()
    : false;

  // Determine Colors based on status
  const getStatusColor = () => {
    if (isExpired) return colors.actionNegative;
    if (!item.active) return colors.textSecondary;
    return colors.actionPositive;
  };
  const statusColor = getStatusColor();

  // Format Display Data
  const getDiscountDisplay = () => {
    if (item.type === "PERCENTAGE") return `${item.percent_off}%`;
    if (item.type === "FIXED") return `$${item.flat_amount}`;
    return "Bundle";
  };

  const formattedDate = item.valid_to
    ? new Date(item.valid_to).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "No Exp.";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: statusColor,
          opacity: isExpired ? 0.7 : 1,
        },
      ]}
    >
      {/* LEFT SIDE: Info & Meta */}
      <View style={styles.leftSection}>
        <ThemedText variant="subtitle" style={styles.title} numberOfLines={1}>
          {item.name}
        </ThemedText>

        <View style={styles.metaRow}>
          {/* Code Pill */}
          <View
            style={[
              styles.codePill,
              { backgroundColor: colors.backgroundPrimary },
            ]}
          >
            <Feather name="tag" size={10} color={colors.textSecondary} />
            <Text style={[styles.codeText, { color: colors.textPrimary }]}>
              {item.code}
            </Text>
          </View>

          {/* Date */}
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            • {isExpired ? "Exp: " : "Ends: "}
            {formattedDate}
          </Text>
        </View>
      </View>

      {/* RIGHT SIDE: Value & Actions */}
      <View style={styles.rightSection}>
        {/* Value Display */}
        <Text style={[styles.valueText, { color: statusColor }]}>
          {getDiscountDisplay()}
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Switch
            value={item.active}
            onValueChange={(val) => onToggleActive(item.id, val)}
            trackColor={{ false: colors.borderLight, true: colors.accentCO }}
            thumbColor={"#fff"}
            style={styles.compactSwitch}
          />

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.deleteBtn}
          >
            <Feather name="trash-2" size={16} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12, // Reduced padding
    marginBottom: 10, // Reduced margin
    borderRadius: 10,
    borderTopWidth: 4, // The status strip
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  codePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  dateText: {
    fontSize: 11,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  compactSwitch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], // Make switch smaller
    marginRight: -4, // Correct visual spacing after scaling
  },
  deleteBtn: {
    padding: 4,
  },
});
