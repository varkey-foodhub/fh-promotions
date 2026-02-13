import { useThemeColor } from "@/src/hooks/useThemeColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CouponBox from "./CouponBox";
import DiscountSlider from "./DiscountSlider";

const Promotions = () => {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.backgroundElevated },
        ]}
      >
        <DiscountSlider />
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.backgroundElevated },
        ]}
      >
        <CouponBox />
      </View>
    </View>
  );
};

export default Promotions;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 14,
  },
});
