import { useThemeColor } from "@/src/hooks/useThemeColors";
import { ThemedText } from "@/src/themed/ThemedText";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useFoodImages } from "../../photos/pexels.query";
import { MenuItem } from "../menu.types";
const { width } = Dimensions.get("window");
// Calculate card width for 2 columns with padding
// Screen Padding (16*2) + Gap (12) = 44 total deduction
const CARD_WIDTH = (width - 44) / 2;

interface MenuEditorItemCardProps {
  item: MenuItem;
  onToggleStock: (id: number, currentStatus: boolean) => void;
}

export const MenuEditorItemCard = ({
  item,
  onToggleStock,
}: MenuEditorItemCardProps) => {
  const colors = useThemeColor();
  const isOutOfStock = item.out_of_stock;
  const { data } = useFoodImages(item.name);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElevated,
          // Subtle shadow like the screenshot
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
      ]}
    >
      {/* 1. Image Section (Top Half) */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data?.[0]?.src?.medium }}
          style={[styles.image, isOutOfStock && styles.imageGrayscale]}
        />
        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <View
            style={[
              styles.overlay,
              { backgroundColor: "rgba(255,255,255,0.8)" },
            ]}
          >
            <ThemedText
              variant="caption"
              style={{
                fontWeight: "bold",
                color: colors.textSecondary,
                letterSpacing: 1,
              }}
            >
              SOLD OUT
            </ThemedText>
          </View>
        )}
      </View>

      {/* 2. Content Section (Bottom Half) */}
      <View style={styles.content}>
        {/* Title */}
        <ThemedText
          variant="default"
          numberOfLines={2}
          style={{ fontWeight: "700", marginBottom: 4, height: 40 }}
        >
          {item.name}
        </ThemedText>

        {/* Price (Red, like screenshot) */}
        <ThemedText
          variant="subtitle"
          style={{ color: colors.accentCO, fontWeight: "800" }}
        >
          ₹{item.price.toFixed(0)}
          {/* Note: Screenshot used ₹44411 format, removed decimals for style match */}
        </ThemedText>

        {/* 3. Action Button (Bottom Right) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggleStock(item.id, item.out_of_stock)}
          style={[
            styles.actionButton,
            {
              // Red (CO) for normal actions, Green (CM) to restore stock
              backgroundColor: isOutOfStock
                ? colors.actionPositive // "Restock"
                : colors.actionNegative, // "Disable" (matches the Red ADD button)
            },
          ]}
        >
          <ThemedText
            variant="caption"
            style={{
              fontWeight: "900",
              color: colors.textInverse,
              fontSize: 10,
            }}
          >
            {isOutOfStock ? "RESTOCK" : "DISABLE"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: "visible", // Allowed for shadow
    marginBottom: 16,
    // Ensure content stays inside borders despite visible overflow for shadow
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden", // Clip the image to rounded corners
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGrayscale: {
    opacity: 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 12,
    paddingBottom: 16,
  },
  actionButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20, // Pill shape
    alignItems: "center",
    justifyContent: "center",
  },
});
