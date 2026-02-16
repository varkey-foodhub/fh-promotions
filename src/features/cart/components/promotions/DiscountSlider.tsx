import { validate } from "@/src/features/promotions/promotions.conditions.validator";
import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // Slightly smaller for peek effect
const SPACING = 16;

// Helper function to format validation errors for better UX
const formatErrorMessage = (error: string): string => {
  if (error.includes("required_item_ids missing")) {
    return "Add required items to cart";
  }
  if (error.includes("min_order_value not met")) {
    const match = error.match(/need (\d+)/);
    if (match) {
      return `Minimum order ₹${match[1]} required`;
    }
    return "Minimum order value not met";
  }
  if (error.includes("required_item_ids must be an array")) {
    return "Invalid promotion configuration";
  }
  return error;
};

const DiscountSlider = () => {
  const colors = useThemeColor();
  const { data = [], isLoading } = useDiscounts();

  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);
  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

  const [validationStatus, setValidationStatus] = useState<
    Record<number, { valid: boolean; error?: string }>
  >({});

  const discounts = useMemo(
    () => data.filter((p) => p.application_method === "DISCOUNT"),
    [data],
  );

  // Validate all discounts whenever cart changes
  useEffect(() => {
    const validateDiscounts = async () => {
      const order = {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: subtotal,
      };

      const results: Record<number, { valid: boolean; error?: string }> = {};

      for (const discount of discounts) {
        const result = await validate(discount, order);
        results[discount.id] = result.valid
          ? { valid: true }
          : { valid: false, error: result.error };
      }

      setValidationStatus(results);
    };

    if (discounts.length > 0) {
      validateDiscounts();
    }
  }, [discounts, cartItems, subtotal]);

  if (isLoading || discounts.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={discounts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: SPACING,
        }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        renderItem={({ item }) => {
          const isApplied = appliedPromotion?.id === item.id;
          const validation = validationStatus[item.id];
          const isValid = validation?.valid !== false;
          const errorMessage = validation?.error
            ? formatErrorMessage(validation.error)
            : undefined;

          return (
            <View
              style={[
                styles.voucherCard,
                {
                  backgroundColor: colors.backgroundElevated,
                  borderColor: isValid ? colors.borderLight : "#FFE5E5",
                  opacity: !isValid && !isApplied ? 0.7 : 1,
                },
              ]}
            >
              <View style={styles.cardContent}>
                {/* Left Section */}
                <View style={styles.leftContent}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: !isValid ? "#F5F5F5" : "#FFF5F5" },
                    ]}
                  >
                    <Feather
                      name="tag"
                      size={16}
                      color={!isValid ? "#999" : "#FF4444"}
                    />
                  </View>

                  <View style={styles.discountInfo}>
                    <Text
                      style={[
                        styles.discountValue,
                        {
                          color: !isValid
                            ? colors.textSecondary
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {item.type === "PERCENTAGE"
                        ? `${item.percent_off}% OFF`
                        : `₹${item.flat_amount} OFF`}
                    </Text>

                    <Text
                      style={[
                        styles.promoCode,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.code}
                    </Text>

                    {/* Error Message */}
                    {!isValid && errorMessage && (
                      <Text style={styles.errorText} numberOfLines={2}>
                        {errorMessage}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  disabled={isApplied || !isValid}
                  onPress={async () => await applyPromotion(item, [])}
                  style={[
                    styles.applyBtn,
                    {
                      backgroundColor: isApplied
                        ? colors.borderLight
                        : !isValid
                          ? "#E0E0E0"
                          : colors.textPrimary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.applyBtnText,
                      {
                        color: isApplied
                          ? colors.textSecondary
                          : !isValid
                            ? "#999"
                            : colors.textInverse,
                      },
                    ]}
                  >
                    {isApplied ? "APPLIED" : !isValid ? "UNAVAILABLE" : "APPLY"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default DiscountSlider;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  voucherCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  discountInfo: {
    gap: 2,
    flex: 1,
  },
  discountValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  promoCode: {
    fontSize: 12,
    fontWeight: "400",
  },
  applyBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 11,
    color: "#FF4444",
    marginTop: 4,
    lineHeight: 14,
  },
});
