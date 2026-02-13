import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MenuItem } from "../features/menu/menu.types";
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

  applyPromotion: (promotion: Promotion) => boolean;
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
      // Cart Actions
      // ----------------------------

      addItem: (item, qty = 1) => {
        if (item.out_of_stock) return;

        const existing = get().items.find((i) => i.id === item.id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: qty }],
          });
        }

        get().recalculate();
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
        get().recalculate();
      },

      increment: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        });
        get().recalculate();
      },

      decrement: (id) => {
        set({
          items: get()
            .items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        });
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
      // Promotion Logic
      // ----------------------------

      applyPromotion: (promotion) => {
        const now = new Date();

        const isValid =
          promotion.active &&
          new Date(promotion.valid_from) <= now &&
          new Date(promotion.valid_to) >= now;

        if (!isValid) return false;

        set({ appliedPromotion: promotion });
        get().recalculate();

        return true;
      },

      removePromotion: () => {
        set({
          appliedPromotion: null,
          discountAmount: 0,
        });
        get().recalculate();
      },

      // ----------------------------
      // Recalculation Engine
      // ----------------------------

      recalculate: () => {
        const { items, appliedPromotion } = get();

        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        const subtotal = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0,
        );

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

        // Prevent negative totals
        discountAmount = Math.min(discountAmount, subtotal);

        const total = subtotal - discountAmount;

        set({
          totalItems,
          subtotal,
          discountAmount,
          total,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
