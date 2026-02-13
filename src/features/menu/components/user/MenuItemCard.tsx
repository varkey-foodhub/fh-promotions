import { useFoodImages } from "@/src/features/photos/pexels.query";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuItem } from "../../menu.types";
import QuantityStepper from "./QuantityStepper";

interface Props {
  item: MenuItem;
}

const MenuItemCard = ({ item }: Props) => {
  const colors = useThemeColor();
  const { data } = useFoodImages(item.name);

  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === item.id)?.quantity ?? 0,
  );
  const addItem = useCartStore((s) => s.addItem);

  const imageUrl = data?.[0]?.src?.medium;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.borderLight,
          opacity: item.out_of_stock ? 0.85 : 1,
        },
      ]}
    >
      {/* 🔥 IMAGE WRAPPER */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, item.out_of_stock && styles.grayscaleImage]}
        />

        {item.out_of_stock && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: colors.textPrimary }]}
        >
          {item.name}
        </Text>

        <Text style={[styles.price, { color: colors.textSecondary }]}>
          ₹{item.price}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        {item.out_of_stock ? (
          <View
            style={[styles.disabledBtn, { borderColor: colors.borderLight }]}
          >
            <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>
              UNAVAILABLE
            </Text>
          </View>
        ) : quantity === 0 ? (
          <TouchableOpacity
            onPress={() => addItem(item)}
            style={[styles.addBtn, { borderColor: colors.actionPrimary }]}
          >
            <Text
              style={{
                color: colors.actionPrimary,
                fontWeight: "700",
              }}
            >
              ADD
            </Text>
          </TouchableOpacity>
        ) : (
          <QuantityStepper id={item.id} />
        )}
      </View>
    </View>
  );
};

export default React.memo(MenuItemCard);

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 120,
  },

  grayscaleImage: {
    opacity: 0.5, // RN does not support native grayscale filter
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },

  infoContainer: {
    padding: 10,
    gap: 4,
  },

  actionContainer: {
    paddingHorizontal: 10,
    paddingBottom: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
  },

  price: {
    fontSize: 13,
  },

  addBtn: {
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },

  disabledBtn: {
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
});
