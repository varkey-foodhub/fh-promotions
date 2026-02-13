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
      {/* 🔥 DEMO IMAGE */}
      <Image source={{ uri: data?.[0]?.src?.medium }} style={styles.image} />

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

        {item.out_of_stock && <Text style={styles.out}>Out of stock</Text>}
      </View>

      <View style={styles.actionContainer}>
        {quantity === 0 ? (
          <TouchableOpacity
            disabled={item.out_of_stock}
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
  image: {
    width: "100%",
    height: 120,
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
  out: {
    fontSize: 12,
    color: "#ff4d4f",
  },
  addBtn: {
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
});
