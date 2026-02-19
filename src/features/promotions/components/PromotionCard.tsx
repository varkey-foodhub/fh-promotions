import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { type Promotion } from "../promotions.types";

interface Props {
  item: Promotion;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, currentValue: boolean) => void;
}

export const PromotionCard = ({ item, onDelete, onToggleActive }: Props) => {
  const colors = useThemeColor();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 900;

  // --- Logic ---
  const isExpired = item.valid_to
    ? new Date(item.valid_to) < new Date()
    : false;

  // Status Colors
  const getStatusConfig = () => {
    if (isExpired) {
      return {
        color: colors.actionNegative,
        bgColor: colors.actionNegative + "15",
        label: "EXPIRED",
        icon: "time-outline" as const,
      };
    }
    if (!item.active) {
      return {
        color: colors.textSecondary,
        bgColor: colors.textSecondary + "15",
        label: "INACTIVE",
        icon: "pause-circle-outline" as const,
      };
    }
    return {
      color: colors.actionPositive,
      bgColor: colors.actionPositive + "15",
      label: "ACTIVE",
      icon: "checkmark-circle" as const,
    };
  };

  const status = getStatusConfig();

  // Format Display Data
  const getDiscountDisplay = () => {
    if (item.type === "PERCENTAGE") {
      return {
        value: `${item.percent_off}%`,
        label: "OFF",
      };
    }
    if (item.type === "FIXED") {
      return {
        value: `₹${item.flat_amount}`,
        label: "OFF",
      };
    }
    return {
      value: "Bundle",
      label: "",
    };
  };

  const discount = getDiscountDisplay();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No Expiry";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View
      style={[
        styles.card,
        isDesktop && styles.cardDesktop,
        {
          backgroundColor: colors.backgroundElevated,
          opacity: isExpired ? 0.7 : 1,
        },
      ]}
    >
      {/* Discount Badge - Left Side */}
      <View style={[styles.discountBadge, { backgroundColor: status.bgColor }]}>
        <Text style={[styles.discountValue, { color: status.color }]}>
          {discount.value}
        </Text>
        {discount.label && (
          <Text style={[styles.discountLabel, { color: status.color }]}>
            {discount.label}
          </Text>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.contentSection}>
        {/* Title & Status Badge */}
        <View style={styles.titleRow}>
          <ThemedText variant="subtitle" style={styles.title} numberOfLines={1}>
            {item.name}
          </ThemedText>
          <View
            style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
          >
            <Ionicons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Code & Date Info */}
        <View style={styles.infoRow}>
          <View style={styles.codeContainer}>
            <Feather
              name="tag"
              size={12}
              color={colors.textSecondary}
              style={{ opacity: 0.6 }}
            />
            <Text style={[styles.codeText, { color: colors.textPrimary }]}>
              {item.code}
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={colors.textSecondary}
              style={{ opacity: 0.6 }}
            />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {isExpired ? "Expired: " : "Ends: "}
              {formatDate(item.valid_to)}
            </Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>
              {item.active ? "Active" : "Inactive"}
            </Text>
            <Switch
              value={item.active}
              onValueChange={(val) => onToggleActive(item.id, val)}
              trackColor={{
                false: colors.borderLight,
                true: status.color + "40",
              }}
              thumbColor={item.active ? status.color : "#f4f3f4"}
              ios_backgroundColor={colors.borderLight}
            />
          </View>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={[
              styles.deleteButton,
              { backgroundColor: colors.actionNegative + "15" },
            ]}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={16} color={colors.actionNegative} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDesktop: {
    width: 650,
  },
  discountBadge: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  discountValue: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  discountLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
  },
  codeText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
