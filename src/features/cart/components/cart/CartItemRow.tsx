import { useFoodImages } from "@/src/features/photos/pexels.query";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import {
  decrementRequest,
  incrementRequest,
} from "@/src/store/cart/cart.slice";
import { useAppDispatch } from "@/src/store/cart/hooks";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const CartItemRow = ({ item }: any) => {
  const colors = useThemeColor();
  const dispatch = useAppDispatch();
  const increment = (id: number, isPromotional?: boolean) =>
    dispatch(incrementRequest({ id, isPromotional }));
  const decrement = (id: number, isPromotional?: boolean) =>
    dispatch(decrementRequest({ id, isPromotional }));
  const { data } = useFoodImages(item.name);
  const imageUrl = data?.[0]?.src?.medium;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.borderLight,
        },
      ]}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        style={styles.image}
      />

      <View style={styles.middle}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.name, { color: colors.textPrimary }]}
        >
          {item.name}
        </Text>

        <Text style={{ color: colors.textSecondary }}>₹{item.price}</Text>
      </View>

      <View style={styles.stepper}>
        <TouchableOpacity onPress={() => decrement(item.id)}>
          <Text style={styles.arrow}>−</Text>
        </TouchableOpacity>

        <Text style={[styles.qty, { color: colors.textPrimary }]}>
          {item.quantity}
        </Text>

        <TouchableOpacity onPress={() => increment(item.id)}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CartItemRow);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  middle: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: "700",
  },
  qty: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
});
