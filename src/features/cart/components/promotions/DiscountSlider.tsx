import { validate } from "@/src/features/promotions/promotions.conditions.validator";
import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { applyPromotionRequest } from "@/src/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/src/store/cart/hooks";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const device = Platform.OS;
const CARD_WIDTH = device === "web" ? SCREEN_WIDTH * 0.25 : SCREEN_WIDTH * 0.65;
const SPACING = 16;

const formatErrorMessage = (error: string): string => {
  if (error.includes("required_item_ids missing")) {
    return "Add required items to cart";
  }
  if (error.includes("min_order_value not met")) {
    const match = error.match(/need (\d+)/);
    if (match) return `Minimum order ₹${match[1]} required`;
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
  const dispatch = useAppDispatch();

  const applyPromotion = (promotion: any, resolvedBundleItems: any[]) =>
    dispatch(applyPromotionRequest({ promotion, resolvedBundleItems }));

  const appliedPromotion = useAppSelector((s) => s.cart.appliedPromotion);
  const cartItems = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => s.cart.subtotal);

  const [activeIndex, setActiveIndex] = useState(0);
  const [validationStatus, setValidationStatus] = useState<
    Record<number, { valid: boolean; error?: string }>
  >({});

  const discounts = useMemo(
    () => data.filter((p) => p.application_method === "DISCOUNT"),
    [data],
  );

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

    if (discounts.length > 0) validateDiscounts();
  }, [discounts, cartItems, subtotal]);

  const handleScroll = (e: any) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING),
    );
    setActiveIndex(index);
  };

  if (isLoading || discounts.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={discounts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
                  onPress={() => applyPromotion(item, [])}
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

      {/* Dot indicators */}
      {discounts.length > 1 && (
        <View style={styles.dotsContainer}>
          {discounts.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? colors.textPrimary : colors.borderLight,
                  width: i === activeIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
