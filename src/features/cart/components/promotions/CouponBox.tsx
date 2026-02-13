import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CouponBox = () => {
  const colors = useThemeColor();
  const { data = [] } = useDiscounts();
  const applyPromotion = useCartStore((s) => s.applyPromotion);

  const [couponCode, setCouponCode] = useState("");

  const handleApply = () => {
    const promo = data.find(
      (p) =>
        p.application_method === "CODE" &&
        p.code.toLowerCase() === couponCode.trim().toLowerCase(),
    );

    if (promo) {
      applyPromotion(promo);
      setCouponCode("");
    }
  };

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Have a Coupon?
      </Text>

      <View style={[styles.row, { borderColor: colors.borderLight }]}>
        <TextInput
          placeholder="Enter coupon code"
          placeholderTextColor={colors.textSecondary}
          value={couponCode}
          onChangeText={setCouponCode}
          style={[styles.input, { color: colors.textPrimary }]}
        />

        <TouchableOpacity
          onPress={handleApply}
          style={[styles.applyBtn, { backgroundColor: colors.actionPrimary }]}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CouponBox;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
