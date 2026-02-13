import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CIRCLE_SIZE = 12;
const CIRCLE_SPACING = 8;

const CartSummary = () => {
  const colors = useThemeColor();

  const subtotal = useCartStore((s) => s.subtotal);
  const total = useCartStore((s) => s.total);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const appliedPromotion = useCartStore((s) => s.appliedPromotion);
  const removePromotion = useCartStore((s) => s.removePromotion);

  const hasDiscount = discountAmount > 0;

  return (
    <View style={styles.shadowContainer}>
      {/* Main Receipt Body */}
      <View
        style={[
          styles.receiptContainer,
          { backgroundColor: colors.backgroundElevated },
        ]}
      >
        {/* SECTION TITLE */}
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Order Summary
        </Text>

        <View
          style={[styles.dashedLine, { borderColor: colors.borderLight }]}
        />

        {/* SUBTOTAL */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Subtotal
          </Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            ₹{subtotal.toFixed(2)}
          </Text>
        </View>

        {/* PROMOTION */}
        {appliedPromotion && (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Promotion
              </Text>
              <Text style={{ color: colors.actionPrimary, fontSize: 12 }}>
                {appliedPromotion.code}
              </Text>
            </View>

            <TouchableOpacity onPress={removePromotion}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  textDecorationLine: "underline",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DISCOUNT */}
        {hasDiscount && (
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Discount
            </Text>
            <Text style={[styles.discount, { color: colors.actionPrimary }]}>
              -₹{discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        {/* DIVIDER */}
        <View
          style={[styles.dashedLine, { borderColor: colors.borderLight }]}
        />

        {/* TOTAL */}
        <View style={styles.row}>
          <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
            TOTAL
          </Text>
          <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
            ₹{total.toFixed(2)}
          </Text>
        </View>

        {/* YOU SAVED */}
        {hasDiscount && (
          <View style={styles.savedContainer}>
            <Text style={[styles.savedText, { color: colors.textInverse }]}>
              You saved ₹{discountAmount.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Serrated Edge (The Tear) */}
      <ReceiptZigZag
        backgroundColor={colors.backgroundElevated}
        maskColor={colors.backgroundSecondary}
      />
    </View>
  );
};

// --- Helper Component for the "Torn" look ---
const ReceiptZigZag = ({
  backgroundColor,
  maskColor,
}: {
  backgroundColor: string;
  maskColor: string;
}) => {
  return (
    <View
      style={[styles.zigzagContainer, { backgroundColor: backgroundColor }]}
    >
      {/* We render a row of circles that match the screen background color 
          to "mask" the bottom of the white card */}
      <View style={styles.zigzagRow}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[styles.zigzagCircle, { backgroundColor: maskColor }]}
          />
        ))}
      </View>
    </View>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  shadowContainer: {
    // Soft drop shadow to make the paper "lift" off the screen
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  receiptContainer: {
    padding: 20,
    borderTopLeftRadius: 6, // Slight radius on top
    borderTopRightRadius: 6,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dashedLine: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 1,
    height: 1,
    opacity: 0.4,
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", // Receipt font
  },
  discount: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  savedContainer: {
    backgroundColor: "#000", // High contrast black strip like a printed footer
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: "center",
  },
  savedText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
  },

  // --- ZigZag Styles ---
  zigzagContainer: {
    height: 12, // Height of the "teeth"
    overflow: "hidden",
    position: "relative",
  },
  zigzagRow: {
    flexDirection: "row",
    position: "absolute",
    bottom: -6, // Shift circles down to cut into the view
    left: -6, // Shift left to ensure coverage
    right: -6,
    justifyContent: "space-between",
  },
  zigzagCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: -2, // Overlap slightly
  },
});
