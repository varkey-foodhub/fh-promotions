import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CartSummary = () => {
  const colors = useThemeColor();

  const subtotal = useCartStore((s) => s.subtotal);
  const total = useCartStore((s) => s.total);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);
  const removePromotion = useCartStore((s) => s.removePromotion);

  const hasDiscount = discountAmount > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundElevated }]}
    >
      {/* SECTION TITLE */}
      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Order Summary
      </Text>

      {/* SUBTOTAL */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Subtotal
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          ₹{subtotal.toFixed(2)}
        </Text>
      </View>

      {/* PROMOTION */}
      {appliedPromotion && (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Promotion Applied
            </Text>
            <Text style={{ color: colors.actionPrimary, fontSize: 13 }}>
              {appliedPromotion.name}
            </Text>
          </View>

          <TouchableOpacity onPress={removePromotion}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DISCOUNT */}
      {hasDiscount && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Discount
          </Text>
          <Text style={[styles.discount, { color: colors.actionPrimary }]}>
            -₹{discountAmount.toFixed(2)}
          </Text>
        </View>
      )}

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

      {/* TOTAL */}
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
          Total to Pay
        </Text>
        <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
          ₹{total.toFixed(2)}
        </Text>
      </View>

      {/* YOU SAVED */}
      {hasDiscount && (
        <Text style={[styles.savedText, { color: colors.actionPrimary }]}>
          🎉 You saved ₹{discountAmount.toFixed(2)} on this order
        </Text>
      )}
    </View>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    gap: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  discount: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    opacity: 0.3,
  },
  savedText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
