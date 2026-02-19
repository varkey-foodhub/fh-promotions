// src/components/ui/CartPage.tsx
import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useAppSelector } from "@/src/store/cart/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItemRow from "./cart/CartItemRow";
import CartSummary from "./cart/CartSummary";
import CheckoutBar from "./cart/CheckoutBar";
import Promotions from "./promotions";

const CartPage = () => {
  const colors = useThemeColor();
  const router = useRouter();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useAppSelector((s) => s.cart.subtotal);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      {/* ── HEADER ── */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Cart
        </Text>
        <View style={{ width: 40 }} /> {/* Spacer to perfectly center title */}
      </View>

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <View style={styles.webLayoutWrapper}>
        {/* LEFT COLUMN: Scrollable Items & Promotions */}
        <ScrollView
          style={styles.leftColumn}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: Cart Items */}
          <View
            style={[
              styles.whiteBox,
              { backgroundColor: colors.backgroundElevated },
            ]}
          >
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="cart-outline"
                  size={48}
                  color={colors.borderMedium}
                />
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  Your cart is empty
                </Text>
              </View>
            ) : (
              <View>
                {items.map((item) => (
                  <View
                    key={`${item.id}-${item.isPromotional ? "promo" : "paid"}`}
                  >
                    <CartItemRow item={item} />
                  </View>
                ))}

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.borderLight },
                  ]}
                />

                <View style={styles.rowBetween}>
                  <Text
                    style={[styles.subLabel, { color: colors.textSecondary }]}
                  >
                    Subtotal
                  </Text>
                  <Text
                    style={[styles.totalText, { color: colors.textPrimary }]}
                  >
                    ₹{subtotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* SECTION 2: Promotions */}
          {items.length !== 0 && (
            <View
              style={[
                styles.whiteBox,
                { backgroundColor: colors.backgroundElevated },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Promotions
              </Text>
              <Promotions />
            </View>
          )}
        </ScrollView>

        {/* RIGHT COLUMN: Sticky Summary & Checkout */}
        {items.length !== 0 && (
          <View style={styles.rightColumn}>
            {/* Receipt / Order Summary Card */}
            <View
              style={[
                styles.whiteBox,
                styles.summaryBox, // Custom margin to hug the checkout button
                { backgroundColor: colors.backgroundElevated },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Order Summary
              </Text>
              <CartSummary />
            </View>

            {/* Checkout Button directly aligned underneath */}
            <View style={styles.checkoutWrapper}>
              <CheckoutBar inline />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  backBtn: {
    padding: 8,
    marginLeft: -8, // optical alignment
  },

  // Web Layout Wrapper
  webLayoutWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around", // Centers the columns on ultra-wide screens
    alignItems: "flex-start", // Prevents the right column from stretching vertically

    gap: 32,

    width: "100%",
    alignSelf: "center",
  },

  // Left Column (Flexible & Scrollable)
  leftColumn: {
    flex: 1,
    maxWidth: 750,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Right Column (Fixed Width & Sticky)
  rightColumn: {
    width: 380,
    // Emulates position: sticky for web so it stays in view while the left side scrolls
    position: "sticky" as any,
    top: 32,
    flexDirection: "column",
    gap: 12,
  },

  // Shared Box Styles (Now with active shadows for web)
  whiteBox: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    // Web-optimized subtle shadow to make the cards pop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  summaryBox: {
    marginBottom: 0,
  },
  checkoutWrapper: {
    width: "100%",
    position: "relative", // Ensures it acts as a normal block element
  },

  // Typography & Dividers
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "800",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
