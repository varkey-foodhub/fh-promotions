// src/components/ui/WebCartBar.tsx
import { CartItem } from "@/src/features/cart/cart.types";
import { useThemeColor } from "@/src/hooks/useThemeColors";
import {
  decrementRequest,
  incrementRequest,
  removeItemRequest,
} from "@/src/store/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/src/store/cart/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WebCartBar = () => {
  const colors = useThemeColor();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const items = useAppSelector((s) => s.cart.items);
  const totalItems = useAppSelector((s) => s.cart.totalItems);
  const subtotal = useAppSelector((s) => s.cart.subtotal);
  const discountAmount = useAppSelector((s) => s.cart.discountAmount);
  const total = useAppSelector((s) => s.cart.total);

  const toggle = () => setExpanded((prev) => !prev);

  const handleCheckout = () => {
    router.navigate("/menu/cart");
  };

  return (
    <View
      style={[
        styles.wrapper,
        expanded ? styles.wrapperExpanded : styles.wrapperCollapsed,
        {
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.borderLight,
        },
      ]}
    >
      {/* ── HEADER BAR (always visible) ── */}
      <TouchableOpacity
        style={[styles.header, { borderBottomColor: colors.borderLight }]}
        onPress={toggle}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          {/* Cart icon */}
          <View style={[styles.iconWrap, { backgroundColor: colors.accentCO }]}>
            <Ionicons name="cart" size={16} color={colors.textInverse} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Cart
          </Text>
          {totalItems > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accentCO }]}>
              <Text style={[styles.badgeText, { color: colors.textInverse }]}>
                {totalItems}
              </Text>
            </View>
          )}
        </View>

        {/* Expand/Collapse Arrow */}
        <Ionicons
          name={expanded ? "chevron-down" : "chevron-up"}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* ── EXPANDED CONTENT ── */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Items list */}
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="cart-outline"
                size={48}
                color={colors.borderMedium}
                style={{ marginBottom: 12 }}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Your cart is empty
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.itemsList}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item: CartItem) => (
                <View
                  key={`${item.id}-${item.isPromotional}`}
                  style={[
                    styles.itemRow,
                    { borderBottomColor: colors.borderLight },
                  ]}
                >
                  {/* Item info */}
                  <View style={styles.itemInfo}>
                    {item.isPromotional && (
                      <Text
                        style={[
                          styles.promoTag,
                          { color: colors.textPositive },
                        ]}
                      >
                        FREE
                      </Text>
                    )}
                    <Text
                      style={[styles.itemName, { color: colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.itemPrice,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.isPromotional
                        ? "₹0.00"
                        : `₹${(item.price * item.quantity).toFixed(2)}`}
                    </Text>
                  </View>

                  {/* Qty controls */}
                  {!item.isPromotional ? (
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={[
                          styles.qtyBtn,
                          { borderColor: colors.borderMedium },
                        ]}
                        onPress={() =>
                          dispatch(
                            decrementRequest({
                              id: item.id,
                              isPromotional: false,
                            }),
                          )
                        }
                      >
                        <Ionicons
                          name="remove"
                          size={16}
                          color={colors.textPrimary}
                        />
                      </TouchableOpacity>

                      <Text style={[styles.qty, { color: colors.textPrimary }]}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        style={[
                          styles.qtyBtn,
                          { borderColor: colors.borderMedium },
                        ]}
                        onPress={() =>
                          dispatch(
                            incrementRequest({
                              id: item.id,
                              isPromotional: false,
                            }),
                          )
                        }
                      >
                        <Ionicons
                          name="add"
                          size={16}
                          color={colors.textPrimary}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() =>
                          dispatch(
                            removeItemRequest({
                              id: item.id,
                              isPromotional: false,
                            }),
                          )
                        }
                      >
                        <Ionicons
                          name="close"
                          size={18}
                          color={colors.textTertiary}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text
                      style={[styles.promoQty, { color: colors.textSecondary }]}
                    >
                      x{item.quantity}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {/* ── TOTALS ── */}
          {items.length > 0 && (
            <View
              style={[styles.totals, { borderTopColor: colors.borderLight }]}
            >
              <View style={styles.totalRow}>
                <Text
                  style={[styles.totalLabel, { color: colors.textSecondary }]}
                >
                  Subtotal
                </Text>
                <Text
                  style={[styles.totalValue, { color: colors.textPrimary }]}
                >
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.totalRow}>
                  <Text
                    style={[styles.totalLabel, { color: colors.textPositive }]}
                  >
                    Discount
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: colors.textPositive }]}
                  >
                    − ₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text
                  style={[styles.totalLabelBold, { color: colors.textPrimary }]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.totalValueBold,
                    { color: colors.textAccentCO },
                  ]}
                >
                  ₹{total.toFixed(2)}
                </Text>
              </View>

              {/* Checkout button */}
              <TouchableOpacity
                style={[
                  styles.checkoutBtn,
                  { backgroundColor: colors.actionPrimary },
                ]}
                onPress={handleCheckout}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.checkoutText, { color: colors.textInverse }]}
                >
                  Checkout →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default WebCartBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute" as any,
    bottom: 0,
    right: 24,
    width: 340,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0, // Removes double border on the bottom edge
    overflow: "hidden",
    // Elevated shadow styling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  wrapperCollapsed: {
    height: 60,
  },
  wrapperExpanded: {
    maxHeight: 540,
  },

  // Header
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  // Expanded Content
  expandedContent: {
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
  },
  itemsList: {
    maxHeight: 280,
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  promoTag: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "500",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    marginLeft: 4,
    padding: 4,
  },
  promoQty: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Totals
  totals: {
    padding: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalRowFinal: {
    marginTop: 6,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 14, fontWeight: "500" },
  totalValue: { fontSize: 14, fontWeight: "600" },
  totalLabelBold: { fontSize: 16, fontWeight: "800" },
  totalValueBold: { fontSize: 18, fontWeight: "900" },

  // Checkout Button
  checkoutBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
