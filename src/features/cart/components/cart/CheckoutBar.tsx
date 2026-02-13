import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CheckoutBar = () => {
  const colors = useThemeColor();
  const subtotal = useCartStore((s) => s.subtotal);

  return (
    <View style={[styles.container, { backgroundColor: colors.actionPrimary }]}>
      <View>
        <Text style={styles.totalText}>₹{subtotal}</Text>
        <Text style={styles.subLabel}>Final amount may change</Text>
      </View>

      <TouchableOpacity>
        <Text style={styles.checkout}>Checkout →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutBar;

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
  totalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  subLabel: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  checkout: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});
