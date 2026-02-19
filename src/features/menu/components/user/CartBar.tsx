import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useAppSelector } from "@/src/store/cart/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const CartBar = () => {
  const colors = useThemeColor();
  const totalItems = useAppSelector((s) => s.cart.totalItems);
  const subtotal = useAppSelector((s) => s.cart.subtotal);
  const router = useRouter();
  const goToCart = () => {
    router.navigate("/menu/cart");
  };

  if (totalItems === 0) return null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.actionPrimary }]}
      onPress={goToCart}
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
