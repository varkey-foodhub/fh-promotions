import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuantityStepper = ({ id }: { id: number }) => {
  const colors = useThemeColor();
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.id === id)?.quantity ?? 0,
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.actionPrimary,
          backgroundColor: colors.backgroundElevated,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => decrement(id)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={[styles.symbol, { color: colors.actionPrimary }]}>−</Text>
      </TouchableOpacity>

      <Text style={[styles.qty, { color: colors.textPrimary }]}>{qty}</Text>

      <TouchableOpacity
        onPress={() => increment(id)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={[styles.symbol, { color: colors.actionPrimary }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(QuantityStepper);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 6,
  },

  button: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  symbol: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 20,
  },

  qty: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
