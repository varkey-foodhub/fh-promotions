import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MenuItem } from "../features/menu/menu.types";
import { validate } from "../features/promotions/promotions.conditions.validator";
import { Bundle, Promotion } from "../features/promotions/promotions.types";

export type CartItem = MenuItem & {
  quantity: number;
};

interface CartState {
  items: CartItem[];

  // 🔥 Promotion
  appliedPromotion: Promotion | null;
  discountAmount: number;

  totalItems: number;
  subtotal: number;
  total: number;

  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clearCart: () => void;

  applyPromotion: (
    promotion: Promotion,
    resolvedBundleItems: Bundle[],
  ) => Promise<boolean>;
  removePromotion: () => void;

  recalculate: () => void;
}
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromotion: null,
      discountAmount: 0,

      totalItems: 0,
      subtotal: 0,
      total: 0,

      // ----------------------------
      // INTERNAL CALCULATOR
      // ----------------------------

      recalculate: () => {
        const { items, appliedPromotion } = get();

        const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

        // ✅ Force 2 decimal precision
        const subtotalRaw = items.reduce(
          (acc, i) => acc + i.quantity * i.price,
          0,
        );

        const subtotal = Number(subtotalRaw.toFixed(2));

        if (subtotal === 0) {
          set({
            appliedPromotion: null,
            discountAmount: 0,
            totalItems,
            subtotal: 0,
            total: 0,
          });
          return;
        }

        let discountAmount = 0;

        if (appliedPromotion) {
          if (
            appliedPromotion.type === "PERCENTAGE" &&
            appliedPromotion.percent_off
          ) {
            discountAmount = (subtotal * appliedPromotion.percent_off) / 100;
          }

          if (
            appliedPromotion.type === "FIXED" &&
            appliedPromotion.flat_amount
          ) {
            discountAmount = appliedPromotion.flat_amount;
          }
        }

        // ✅ Clamp + round
        discountAmount = Math.min(discountAmount, subtotal);
        discountAmount = Number(discountAmount.toFixed(2));

        const total = Number((subtotal - discountAmount).toFixed(2));

        set({
          totalItems,
          subtotal,
          discountAmount,
          total,
        });
      },

      // ----------------------------
      // CART ACTIONS
      // ----------------------------

      addItem: (item, qty = 1) => {
        if (item.out_of_stock) return;

        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
              )
            : [...state.items, { ...item, quantity: qty }];

          return { items: updatedItems };
        });

        get().recalculate();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        get().recalculate();
      },

      increment: (id) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }));

        get().recalculate();
      },

      decrement: (id) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        }));

        get().recalculate();
      },

      clearCart: () => {
        set({
          items: [],
          appliedPromotion: null,
          discountAmount: 0,
          totalItems: 0,
          subtotal: 0,
          total: 0,
        });
      },

      // ----------------------------
      // PROMOTION LOGIC
      // ----------------------------

      applyPromotion: async (promotion, resolvedBundleItems?: Bundle[]) => {
        const now = new Date();

        const isValid =
          promotion.active &&
          new Date(promotion.valid_from) <= now &&
          (!promotion.valid_to || new Date(promotion.valid_to) >= now);

        if (!isValid) {
          Toast.show({ type: "error", text1: "Promotion Expired" });
          return false;
        }

        const { items, subtotal } = get();

        const order = {
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          total: subtotal,
        };

        const validationResult = await validate(promotion, order);

        if (!validationResult.valid) {
          Toast.show({
            type: "error",
            text1: "Cannot Apply",
            text2: validationResult.error,
          });
          return false;
        }

        // ----------------------------
        // 🔥 BUNDLE LOGIC (UPDATED)
        // ----------------------------
        if (promotion.type === "BUNDLE") {
          if (!resolvedBundleItems || resolvedBundleItems.length === 0) {
            Toast.show({
              type: "error",
              text1: "Bundle Error",
              text2: "Bundle items missing",
            });
            return false;
          }

          set((state) => {
            const updatedItems = [...state.items];

            resolvedBundleItems.forEach((bundleItem) => {
              const existing = updatedItems.find(
                (i) => i.id === bundleItem.item_id,
              );

              if (existing) {
                existing.quantity += bundleItem.quantity;
              } else {
                updatedItems.push({
                  id: bundleItem.item_id,
                  name: bundleItem.name,
                  price: 0, // bundle reward = free
                  out_of_stock: false,
                  quantity: bundleItem.quantity,
                });
              }
            });

            return { items: updatedItems };
          });
        }

        set({ appliedPromotion: promotion });

        get().recalculate();

        Toast.show({
          type: "success",
          text1: "Promotion Applied",
          text2: `${promotion.name} added to cart`,
        });

        return true;
      },

      removePromotion: () => {
        set({ appliedPromotion: null });
        get().recalculate();
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
