import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Promotion } from "../promotions.types";

interface Props {
  item: Promotion;
  onDelete: (id: number) => void;
}

export const PromotionCard = ({ item, onDelete }: Props) => {
  const colors = useThemeColor();

  // Helper to format the "Value" display
  const getValueText = () => {
    if (item.type === "PERCENTAGE") return `${item.percent_off}% OFF`;
    if (item.type === "FIXED") return `Flat $${item.flat_amount}`;
    return "Bundle Deal";
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Name - At the top */}
        <ThemedText variant="subtitle" style={styles.name}>
          {item.name}
        </ThemedText>

        {/* Title */}
        <ThemedText variant="default" style={styles.title}>
          {item.code}
        </ThemedText>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          {/* Value Column */}
          <View style={styles.column}>
            <ThemedText variant="caption" style={{ color: colors.textLight }}>
              Type:
            </ThemedText>
            <ThemedText
              variant="default"
              style={{ color: colors.textSecondary, marginTop: 4 }}
            >
              {getValueText()}
            </ThemedText>
          </View>
        </View>

        {/* Expired Badge */}
        {!item.active && (
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <ThemedText variant="caption" style={{ color: colors.textLight }}>
              Expired
            </ThemedText>
          </View>
        )}
      </View>

      {/* Delete Action */}
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={20} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontWeight: "700",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  column: {
    marginRight: 32, // Spacing between Code and Value
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  deleteBtn: {
    justifyContent: "flex-end",
    paddingBottom: 4,
    paddingLeft: 12,
  },
});

// Export Promotion type for backward compatibility
export { Promotion } from "../promotions.types";
