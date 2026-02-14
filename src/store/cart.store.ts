import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MenuItem } from "../features/menu/menu.types";
import { validate } from "../features/promotions/promotions.conditions.validator";
import { Promotion } from "../features/promotions/promotions.types";

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

  applyPromotion: (promotion: Promotion) => Promise<boolean>;
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

      applyPromotion: async (promotion) => {
        const now = new Date();

        // Check if promotion is active and within valid dates
        const isValid =
          promotion.active &&
          new Date(promotion.valid_from) <= now &&
          new Date(promotion.valid_to) >= now;

        if (!isValid) {
          Toast.show({
            type: "error",
            text1: "Promotion Expired",
            text2: "This promotion is no longer valid",
          });
          return false;
        }

        // Validate conditions if they exist
        const { items, subtotal } = get();
        const order = {
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total: subtotal,
        };

        const validationResult = await validate(promotion, order);

        if (!validationResult.valid) {
          Toast.show({
            type: "error",
            text1: "Cannot Apply Promotion",
            text2: validationResult.error,
          });
          return false;
        }

        // All validations passed - apply the promotion
        set({ appliedPromotion: promotion });
        get().recalculate();

        Toast.show({
          type: "success",
          text1: "Promotion Applied",
          text2: `${promotion.name} has been applied to your cart`,
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
