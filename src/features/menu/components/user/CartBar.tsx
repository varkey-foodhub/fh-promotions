import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CartBar = () => {
  const colors = useThemeColor();
  const totalItems = useCartStore((s) => s.totalItems);
  const subtotal = useCartStore((s) => s.subtotal);

  if (totalItems === 0) return null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.actionPrimary }]}
    >
      <View>
        <Text style={styles.items}>{totalItems} items</Text>
        <Text style={styles.price}>₹{subtotal}</Text>
      </View>

      <Text style={styles.cta}>View Cart →</Text>
    </TouchableOpacity>
  );
};

export default CartBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  items: { color: "white", fontWeight: "700" },
  price: { color: "white", fontSize: 16, fontWeight: "800" },
  cta: { color: "white", fontWeight: "800", fontSize: 16 },
});
