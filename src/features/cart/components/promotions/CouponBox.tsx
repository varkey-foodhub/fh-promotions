import { useValidateCoupon } from "@/src/features/promotions/promotions.queries";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CouponBox = () => {
  const colors = useThemeColor();
  const applyPromotion = useCartStore((s) => s.applyPromotion);
  const removePromotion = useCartStore((s) => s.removePromotion);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);

  const { mutateAsync, isPending } = useValidateCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Handlers ---

  const handleApply = async () => {
    if (!couponCode.trim()) return;

    try {
      setError(null);
      const promo = await mutateAsync(couponCode.trim());

      if (!promo.active) {
        setError("This coupon is no longer active.");
        return;
      }

      // Success Animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      applyPromotion(promo);
      setCouponCode("");
      setIsExpanded(false);
    } catch (err: any) {
      // Shake animation logic could go here
      setError("Invalid coupon code. Please try again.");
    }
  };

  const handleRemove = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removePromotion();
    setError(null);
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Clear error when opening fresh
      setError(null);
    }
  };

  // --- Render: Applied State (Golden Ticket Look) ---
  if (appliedPromotion) {
    return (
      <View
        style={[
          styles.ticketContainer,
          {
            backgroundColor: colors.actionPrimary + "15",
            borderColor: colors.actionPrimary,
          },
        ]}
      >
        <View style={styles.ticketContent}>
          {/* Left Icon */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.actionPrimary },
            ]}
          >
            <MaterialCommunityIcons
              name="ticket-percent"
              size={20}
              color="white"
            />
          </View>

          {/* Middle Info */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.promoName, { color: colors.textPrimary }]}>
              {appliedPromotion.code}
            </Text>
            <Text style={[styles.promoDesc, { color: colors.actionPrimary }]}>
              {appliedPromotion.type === "PERCENTAGE"
                ? `${appliedPromotion.percent_off}% Discount Applied`
                : `₹${appliedPromotion.flat_amount} Discount Applied`}
            </Text>
          </View>

          {/* Remove Button */}
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
            <Feather name="x" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Decorative Circles for Ticket Effect */}
        <View
          style={[
            styles.ticketCircle,
            styles.circleLeft,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.actionPrimary,
            },
          ]}
        />
        <View
          style={[
            styles.ticketCircle,
            styles.circleRight,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.actionPrimary,
            },
          ]}
        />
      </View>
    );
  }

  // --- Render: Default / Input State ---
  return (
    <View style={styles.container}>
      {/* Header / Trigger */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleExpand}
        style={[styles.headerRow, isExpanded && styles.headerExpanded]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Feather
            name="tag"
            size={18}
            color={isExpanded ? colors.textPrimary : colors.textSecondary}
          />
          <Text
            style={[
              styles.headerText,
              { color: isExpanded ? colors.textPrimary : colors.textSecondary },
            ]}
          >
            {isExpanded ? "Apply Coupon Code" : "Have a promo code?"}
          </Text>
        </View>

        {!isExpanded && (
          <Feather
            name="chevron-right"
            size={18}
            color={colors.textSecondary}
          />
        )}
      </TouchableOpacity>

      {/* Expanded Input Area */}
      {isExpanded && (
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: error ? colors.actionNegative : colors.borderLight,
              },
            ]}
          >
            <TextInput
              autoFocus
              placeholder="Enter code (e.g. SAVE20)"
              placeholderTextColor={colors.textLight}
              value={couponCode}
              onChangeText={setCouponCode}
              style={[styles.input, { color: colors.textPrimary }]}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={handleApply}
            />

            {couponCode.length > 0 && (
              <TouchableOpacity
                onPress={() => setCouponCode("")}
                style={{ padding: 4 }}
              >
                <Feather name="x-circle" size={16} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {error && (
            <Text style={[styles.errorText, { color: colors.actionNegative }]}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            disabled={isPending || !couponCode}
            onPress={handleApply}
            style={[
              styles.applyBtn,
              {
                backgroundColor: !couponCode
                  ? colors.borderLight
                  : colors.accentCO, // Black button for high contrast
                opacity: isPending ? 0.7 : 1,
              },
            ]}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={[styles.applyBtnText, { color: colors.textInverse }]}
              >
                APPLY
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CouponBox;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: "hidden",
  },
  // --- Header State ---
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerExpanded: {
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // --- Input State ---
  inputWrapper: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  applyBtn: {
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: -4,
    marginLeft: 4,
  },

  // --- Ticket State (Applied) ---
  ticketContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  ticketContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  promoName: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  promoDesc: {
    fontSize: 12,
    fontWeight: "600",
  },
  removeBtn: {
    padding: 8,
  },
  // Decorative Cutouts
  ticketCircle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    top: "50%",
    marginTop: -10,
    borderWidth: 1,
    borderStyle: "dashed",
    // We only want the border on the inside curve, but standard border works okay for this scale
  },
  circleLeft: {
    left: -12,
  },
  circleRight: {
    right: -12,
  },
});
