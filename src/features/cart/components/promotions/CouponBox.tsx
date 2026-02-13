import { useValidateCoupon } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CouponBox = () => {
  const colors = useThemeColor();

  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const removePromotion = useCartStore((s) => s.removePromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);

  const { mutateAsync, isPending } = useValidateCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!couponCode.trim()) return;

    try {
      setError(null);

      const promo = await mutateAsync(couponCode.trim());

      if (!promo.active) {
        setError("Coupon is not active");
        return;
      }

      applyPromotion(promo);
      setCouponCode("");
    } catch (err: any) {
      setError(err.message);
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
          disabled={isPending}
          onPress={handleApply}
          style={[
            styles.applyBtn,
            {
              backgroundColor: isPending
                ? colors.borderLight
                : colors.actionPrimary,
            },
          ]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "600" }}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: "red", marginTop: 6 }}>{error}</Text>}

      {/* 🔥 APPLIED PROMOTION CARD */}
      {appliedPromotion && appliedPromotion.application_method === "CODE" && (
        <View
          style={[
            styles.appliedCard,
            {
              backgroundColor: colors.backgroundElevated,
              borderColor: colors.actionPrimary,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.appliedTitle, { color: colors.textPrimary }]}>
              {appliedPromotion.name} Applied
            </Text>

            <Text style={{ color: colors.textSecondary }}>
              {appliedPromotion.type === "PERCENTAGE"
                ? `${appliedPromotion.percent_off}% OFF`
                : `₹${appliedPromotion.flat_amount} OFF`}
            </Text>
          </View>

          <TouchableOpacity
            onPress={removePromotion}
            style={[styles.removeBtn, { borderColor: colors.borderLight }]}
          >
            <Text style={{ color: colors.textSecondary }}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
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
  appliedCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  appliedTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
  },
});
