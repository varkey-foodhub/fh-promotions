import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CartSummary = () => {
  const colors = useThemeColor();
  const subtotal = useCartStore((s) => s.subtotal);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundElevated }]}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Cart Total
      </Text>

      <Text style={[styles.total, { color: colors.textPrimary }]}>
        ₹{subtotal}
      </Text>

      {/* Promotions Placeholder */}
      <View style={styles.promoBox}>
        <Text style={{ color: colors.textSecondary }}>
          Promotions will appear here
        </Text>
      </View>
    </View>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    gap: 10,
  },
  label: {
    fontSize: 14,
  },
  total: {
    fontSize: 20,
    fontWeight: "800",
  },
  promoBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
});
