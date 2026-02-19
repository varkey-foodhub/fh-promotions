import { useThemeColor } from "@/src/hooks/useThemeColors";
import {
  decrementRequest,
  incrementRequest,
} from "@/src/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/src/store/cart/hooks";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuantityStepper = ({ id }: { id: number }) => {
  const colors = useThemeColor();
  const dispatch = useAppDispatch();
  const increment = () => dispatch(incrementRequest({ id }));
  const decrement = () => dispatch(decrementRequest({ id }));
  const qty = useAppSelector(
    (s) => s.cart.items.find((i) => i.id === id)?.quantity ?? 0,
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
        onPress={() => decrement()}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={[styles.symbol, { color: colors.actionPrimary }]}>−</Text>
      </TouchableOpacity>

      <Text style={[styles.qty, { color: colors.textPrimary }]}>{qty}</Text>

      <TouchableOpacity
        onPress={() => increment()}
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
