import { useThemeColor } from "@/src/hooks/useThemeColors";
import { useCartStore } from "@/src/store/cart.store";
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
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Cart
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: Cart Items & Subtotal */}
        <View
          style={[
            styles.whiteBox,
            { backgroundColor: colors.backgroundElevated },
          ]}
        >
          {items.length === 0 ? (
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: "center",
                padding: 20,
              }}
            >
              Your cart is empty
            </Text>
          ) : (
            <View>
              {/* List of Items */}
              {items.map((item) => (
                <View
                  key={`${item.id}-${item.isPromotional ? "promo" : "paid"}`}
                >
                  <CartItemRow item={item} />
                </View>
              ))}

              {/* Divider */}
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.borderLight },
                ]}
              />

              {/* Subtotal Row */}
              <View style={styles.rowBetween}>
                <Text
                  style={[styles.subLabel, { color: colors.textSecondary }]}
                >
                  Subtotal
                </Text>
                <Text style={[styles.totalText, { color: colors.textPrimary }]}>
                  ₹{subtotal}
                </Text>
              </View>
            </View>
          )}
        </View>

        {items.length !== 0 && (
          <>
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

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Order Summary
            </Text>
            <CartSummary />
          </>
        )}
      </ScrollView>

      <CheckoutBar />
    </SafeAreaView>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for CheckoutBar
    paddingTop: 8,
  },

  whiteBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Optional: Add shadow if you want it to pop like the screenshot
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 5,
    // elevation: 2,
  },

  divider: {
    height: 1,
    marginVertical: 12,
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  placeholder: {
    paddingVertical: 4,
  },
});
