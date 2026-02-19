import { useThemeColor } from "@/src/hooks/useThemeColors";
import { removePromotionRequest } from "@/src/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/src/store/cart/hooks";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CartSummary = () => {
  const colors = useThemeColor();
  const dispatch = useAppDispatch();

  const items = useAppSelector((s) => s.cart.items); // Get items for the receipt list
  const subtotal = useAppSelector((s) => s.cart.subtotal);
  const total = useAppSelector((s) => s.cart.total);
  const discountAmount = useAppSelector((s) => s.cart.discountAmount);
  const appliedPromotion = useAppSelector((s) => s.cart.appliedPromotion);
  const removePromotion = () => dispatch(removePromotionRequest());

  const hasDiscount = discountAmount > 0;

  // We need the width to calculate how many "teeth" to render
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.shadowContainer} onLayout={onLayout}>
      {/* --- RECEIPT BODY --- */}
      <View
        style={[
          styles.receiptBody,
          { backgroundColor: colors.backgroundElevated },
        ]}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>
            Receipt
          </Text>
          <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString()} • #ORDER-2921
          </Text>
        </View>

        <DashedLine color={colors.borderLight} />

        {/* --- ITEMS LIST --- */}
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View
              key={`${item.id}-${item.isPromotional ? "promo" : "paid"}`}
              style={styles.itemRow}
            >
              {/* QTY & NAME */}
              <View style={styles.itemLeft}>
                <Text style={[styles.qtyText, { color: colors.textPrimary }]}>
                  {item.quantity}x
                </Text>
                <Text
                  style={[styles.itemName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </View>
              {/* PRICE */}
              <Text style={[styles.monoPrice, { color: colors.textPrimary }]}>
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <DashedLine color={colors.borderLight} />

        {/* --- FINANCIALS --- */}
        <View style={styles.financialsContainer}>
          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Subtotal
            </Text>
            <Text style={[styles.monoPrice, { color: colors.textPrimary }]}>
              {subtotal.toFixed(2)}
            </Text>
          </View>

          {/* Promotion */}
          {appliedPromotion && (
            <View style={styles.row}>
              <View>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Promo Code
                </Text>
                <Text
                  style={[styles.codeText, { color: colors.actionPrimary }]}
                >
                  {appliedPromotion.code}
                </Text>
              </View>
              <TouchableOpacity onPress={removePromotion}>
                <Text style={styles.removeText}>[Remove]</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Discount */}
          {hasDiscount && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Discount
              </Text>
              <Text
                style={[styles.monoPrice, { color: colors.actionNegative }]}
              >
                -{discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          {/* Total */}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
              TOTAL
            </Text>
            <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
              ₹{total.toFixed(2)}
            </Text>
          </View>

          {/* Savings Message */}
          {hasDiscount && (
            <Text style={[styles.savedText, { color: colors.textSecondary }]}>
              * You saved ₹{discountAmount.toFixed(2)} *
            </Text>
          )}
        </View>
      </View>

      {/* --- SHARP ZIGZAG EDGE --- */}
      {width > 0 && (
        <SharpJaggedEdge
          width={width}
          backgroundColor={colors.backgroundElevated}
        />
      )}
    </View>
  );
};

// --- Helper: Dashed Divider ---
const DashedLine = ({ color }: { color: string }) => (
  <View style={[styles.dashedLine, { borderColor: color }]} />
);

// --- Helper: Sharp Jagged Edge (Sawtooth) ---// Replace your SharpJaggedEdge component with this:
const SharpJaggedEdge = ({
  width,
  backgroundColor,
}: {
  width: number;
  backgroundColor: string;
}) => {
  if (Platform.OS === "web") {
    // SVG zigzag for web
    const toothWidth = 20;
    const toothHeight = 10;
    const numberOfTeeth = Math.ceil(width / toothWidth);
    const totalWidth = numberOfTeeth * toothWidth;

    // Build SVG path — starts top-left, zigzags down
    let d = `M0,0`;
    for (let i = 0; i < numberOfTeeth; i++) {
      const x1 = i * toothWidth + toothWidth / 2;
      const x2 = (i + 1) * toothWidth;
      d += ` L${x1},${toothHeight} L${x2},0`;
    }
    d += ` L${totalWidth},0 Z`;

    return (
      <svg width={totalWidth} height={toothHeight} style={{ display: "block" }}>
        <path d={d} fill={backgroundColor} />
      </svg>
    );
  }

  // Native — original implementation
  const toothWidth = 20;
  const numberOfTeeth = Math.ceil(width / toothWidth);

  return (
    <View style={[styles.zigzagContainer, { height: toothWidth / 2 }]}>
      {Array.from({ length: numberOfTeeth }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.triangle,
            {
              backgroundColor,
              width: toothWidth / Math.SQRT2,
              height: toothWidth / Math.SQRT2,
              left: index * toothWidth - toothWidth / 2,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    marginHorizontal: 4, // Make room for shadow
  },
  receiptBody: {
    padding: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
    gap: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subHeading: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    textTransform: "uppercase",
  },
  // Divider
  dashedLine: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 1,
    height: 1,
    opacity: 0.5,
    marginVertical: 12,
  },
  // Items List
  itemsContainer: {
    gap: 12,
    marginVertical: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemLeft: {
    flexDirection: "row",
    flex: 1,
    gap: 10,
  },
  qtyText: {
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 14,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textTransform: "uppercase",
  },
  monoPrice: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 14,
    fontWeight: "600",
  },
  // Financials
  financialsContainer: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  codeText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontWeight: "700",
  },
  removeText: {
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  savedText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  // ZigZag / Sawtooth
  zigzagContainer: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
    // No background color here to let triangles shine through
  },
  triangle: {
    position: "absolute",
    top: -10, // Pull up so top half is hidden by receipt body
    transform: [{ rotate: "45deg" }],
  },
});
