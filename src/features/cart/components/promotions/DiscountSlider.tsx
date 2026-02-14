import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
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

const DiscountSlider = () => {
  const colors = useThemeColor();
  const { data = [], isLoading } = useDiscounts();

  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);

  const discounts = useMemo(
    () => data.filter((p) => p.application_method === "DISCOUNT"),
    [data],
  );

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

          return (
            <View
              style={[
                styles.voucherCard,
                {
                  backgroundColor: colors.backgroundElevated,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <View style={styles.cardContent}>
                {/* Left Section */}
                <View style={styles.leftContent}>
                  <View style={styles.iconCircle}>
                    <Feather name="tag" size={16} color="#FF4444" />
                  </View>

                  <View style={styles.discountInfo}>
                    <Text
                      style={[
                        styles.discountValue,
                        { color: colors.textPrimary },
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
                  </View>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  disabled={isApplied}
                  onPress={() => applyPromotion(item)}
                  style={[
                    styles.applyBtn,
                    {
                      backgroundColor: isApplied
                        ? colors.borderLight
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
                          : colors.textInverse,
                      },
                    ]}
                  >
                    {isApplied ? "APPLIED" : "APPLY"}
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
});
