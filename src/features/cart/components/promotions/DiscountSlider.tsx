import { useDiscounts } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import { Feather } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Reduced card width
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const SPACING = 12; // Slightly reduced spacing
const SNAP_INTERVAL = CARD_WIDTH + SPACING;
const AUTO_SLIDE_INTERVAL = 5000;

const DiscountSlider = () => {
  const colors = useThemeColor();
  const { data = [], isLoading } = useDiscounts();

  // Store Hooks
  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);

  // Filter Data
  const discounts = useMemo(
    () => data.filter((p) => p.application_method === "DISCOUNT"),
    [data],
  );

  // Refs & State for Auto-Scroll
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const userTouchedRef = useRef(false);

  // --- Auto Slide Logic ---
  useEffect(() => {
    if (discounts.length <= 1) return;

    const interval = setInterval(() => {
      if (userTouchedRef.current) return;

      let nextIndex = currentIndex + 1;
      if (nextIndex >= discounts.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewOffset: SPACING, // Center the item
      });
      setCurrentIndex(nextIndex);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, discounts.length]);

  // --- Scroll Handlers ---
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.x / SNAP_INTERVAL,
      );
      setCurrentIndex(newIndex);
      userTouchedRef.current = false;
    },
    [],
  );

  const onScrollBeginDrag = () => {
    userTouchedRef.current = true;
  };

  if (isLoading || discounts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Feather name="gift" size={16} color={colors.textPrimary} />
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Exclusive Vouchers
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={discounts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SPACING,
          paddingBottom: 10, // For shadow
          gap: SPACING,
        }}
        renderItem={({ item }) => {
          const isApplied = appliedPromotion?.id === item.id;
          const accentColor = isApplied
            ? colors.textSecondary
            : colors.accentCO;

          return (
            <View
              style={[
                styles.voucherCard,
                {
                  backgroundColor: colors.backgroundElevated,
                  borderColor: isApplied ? colors.borderLight : accentColor,
                },
              ]}
            >
              {/* --- Left Section (Value) --- */}
              <View
                style={[styles.leftSection, { backgroundColor: accentColor }]}
              >
                <Text style={styles.valueText}>
                  {item.type === "PERCENTAGE"
                    ? `${item.percent_off}`
                    : `₹${item.flat_amount}`}
                </Text>
                <Text style={styles.offText}>
                  {item.type === "PERCENTAGE" ? "% OFF" : "OFF"}
                </Text>
                {/* Vertical text for style */}
                <Text style={styles.verticalText}>VOUCHER</Text>
              </View>

              {/* --- Right Section (Details) --- */}
              <View style={styles.rightSection}>
                <View>
                  <Text
                    style={[styles.promoTitle, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.codeContainer}>
                    <Feather
                      name="tag"
                      size={10}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.codeText, { color: colors.textSecondary }]}
                    >
                      {item.code}
                    </Text>
                  </View>
                </View>

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

              {/* --- Decorative "Tear" Line --- */}
              <View style={styles.tearLine} />
              <View
                style={[
                  styles.circle,
                  styles.circleTop,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              />
              <View
                style={[
                  styles.circle,
                  styles.circleBottom,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              />
            </View>
          );
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {discounts.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? colors.accentCO : colors.borderLight,
                width: index === currentIndex ? 12 : 5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default DiscountSlider;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Voucher Card
  voucherCard: {
    width: CARD_WIDTH,
    height: 84, // Reduced height
    borderRadius: 10,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Left Section
  leftSection: {
    width: 70, // Reduced width
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    position: "relative",
  },
  valueText: {
    fontSize: 20, // Reduced font size
    fontWeight: "900",
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  offText: {
    fontSize: 10, // Reduced font size
    fontWeight: "700",
    color: "white",
    marginTop: -2,
  },
  verticalText: {
    position: "absolute",
    left: 2,
    bottom: 4,
    fontSize: 7,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    transform: [{ rotate: "-90deg" }],
    width: 50,
    textAlign: "center",
  },
  // Right Section
  rightSection: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    paddingLeft: 16, // Space for tear line
  },
  promoTitle: {
    fontSize: 13, // Reduced font size
    fontWeight: "700",
    marginBottom: 4,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  codeText: {
    fontSize: 11, // Reduced font size
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontWeight: "600",
  },
  applyBtn: {
    alignSelf: "flex-start",
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  applyBtnText: {
    fontSize: 10, // Reduced font size
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Decorative Elements
  tearLine: {
    position: "absolute",
    left: 69, // Adjusted left position (70 - 1)
    top: 8,
    bottom: 8,
    width: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
    zIndex: 2,
  },
  circle: {
    position: "absolute",
    left: 65, // Adjusted left position (70 - 10/2)
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  circleTop: { top: -5 },
  circleBottom: { bottom: -5 },
  // Pagination
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    height: 5, // Reduced size
    borderRadius: 2.5,
  },
});
