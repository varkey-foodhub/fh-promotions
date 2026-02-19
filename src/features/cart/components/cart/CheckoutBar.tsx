import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useAppSelector } from "@/src/store/cart/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlaceOrder } from "../../cart.query";

interface Props {
  inline?: boolean;
}

const CheckoutBar = ({ inline = false }: Props) => {
  const colors = useThemeColor();
  const total = useAppSelector((s) => s.cart.total);
  const { mutate, isPending } = usePlaceOrder();
  const cart = useAppSelector((s) => s.cart);

  const handleCheckout = () => {
    mutate({
      items: cart.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      })),
      promotion_id: cart.appliedPromotion?.id ?? null,
    });
  };

  return (
    <View
      style={[
        styles.containerBase,
        inline ? styles.containerInline : styles.containerAbsolute,
        { backgroundColor: colors.actionPrimary },
      ]}
    >
      <View>
        <Text style={styles.totalText}>₹{total}</Text>
        <Text style={styles.subLabel}>Final amount may change</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCheckout}>
        <Text style={[styles.checkout, { color: colors.actionPrimary }]}>
          Checkout
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          style={[styles.checkout, { color: colors.actionPrimary }]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutBar;

const styles = StyleSheet.create({
  containerBase: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  containerAbsolute: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  containerInline: {
    position: "relative",
    width: "100%",
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
    fontSize: 18,
    fontWeight: "800",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 4,
    gap: 4,
  },
});
