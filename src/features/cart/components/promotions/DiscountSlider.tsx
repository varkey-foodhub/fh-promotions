import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DiscountSlider = () => {
  const colors = useThemeColor();
  const { data = [], isLoading } = useDiscounts();

  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);

  const discounts = useMemo(
    () => data.filter((p) => p.application_method === "DISCOUNT"),
    [data],
  );

  if (isLoading) {
    return (
      <Text style={{ color: colors.textSecondary }}>Loading discounts...</Text>
    );
  }

  if (discounts.length === 0) return null;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Available Discounts
      </Text>

      <FlatList
        data={discounts}
        horizontal
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const isApplied = appliedPromotion?.id === item.id;

          return (
            <View style={[styles.card, { borderColor: colors.borderLight }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>

                <Text style={{ color: colors.textSecondary }}>
                  {item.type === "PERCENTAGE"
                    ? `${item.percent_off}% OFF`
                    : `₹${item.flat_amount} OFF`}
                </Text>
              </View>

              <TouchableOpacity
                disabled={isApplied}
                onPress={() => applyPromotion(item)}
                style={[
                  styles.applyBtn,
                  {
                    backgroundColor: isApplied
                      ? colors.borderLight
                      : colors.actionPrimary,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isApplied ? colors.textSecondary : "white",
                    fontWeight: "600",
                  }}
                >
                  {isApplied ? "Applied" : "Apply"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </>
  );
};

export default DiscountSlider;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    width: 220,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
