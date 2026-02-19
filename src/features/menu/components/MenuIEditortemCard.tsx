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
const CARD_WIDTH = (width - 44) / 2;

interface MenuEditorItemCardProps {
  item: MenuItem;
  onToggleStock: (id: number, currentStatus: boolean) => void;
  cardWidth?: number; // optional — falls back to native 2-col width
}

export const MenuEditorItemCard = ({
  item,
  onToggleStock,
  cardWidth,
}: MenuEditorItemCardProps) => {
  const colors = useThemeColor();
  const isOutOfStock = item.out_of_stock;
  const { data } = useFoodImages(item.name);

  const resolvedWidth = cardWidth ?? CARD_WIDTH;

  return (
    <View
      style={[
        styles.card,
        {
          width: resolvedWidth,
          backgroundColor: colors.backgroundElevated,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: data?.[0]?.src?.medium }}
          style={[styles.image, isOutOfStock && styles.imageGrayscale]}
        />
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

      {/* Content */}
      <View style={styles.content}>
        <ThemedText
          variant="default"
          numberOfLines={2}
          style={{ fontWeight: "700", marginBottom: 4, height: 40 }}
        >
          {item.name}
        </ThemedText>

        <ThemedText
          variant="subtitle"
          style={{ color: colors.accentCO, fontWeight: "800" }}
        >
          ₹{item.price.toFixed(0)}
        </ThemedText>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggleStock(item.id, item.out_of_stock)}
          style={[
            styles.actionButton,
            {
              backgroundColor: isOutOfStock
                ? colors.actionPositive
                : colors.actionNegative,
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
    borderRadius: 16,
    overflow: "visible",
    marginBottom: 16,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
