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
      // INTERNAL CALCULATOR
      // ----------------------------

      recalculate: () => {
        const { items, appliedPromotion } = get();

        const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

        const subtotal = items.reduce(
          (acc, i) => acc + i.quantity * i.price,
          0,
        );
        if (subtotal === 0) {
          set({ appliedPromotion: null, discountAmount: 0, total: 0 });
          return;
        }

        let discountAmount = 0;

        if (appliedPromotion && subtotal > 0) {
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

        discountAmount = Math.min(discountAmount, subtotal);

        const total = subtotal - discountAmount;

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
