import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "../features/cart/cart.types";
import { MenuItem } from "../features/menu/menu.types";
import { validate } from "../features/promotions/promotions.conditions.validator";
import { Bundle, Promotion } from "../features/promotions/promotions.types";
/**
 * Product type stored in cart
 */

interface CartState {
  items: CartItem[];

  // 🔥 Promotion
  appliedPromotion: Promotion | null;
  discountAmount: number;

  totalItems: number;
  subtotal: number;
  total: number;

  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (id: number, isPromotional?: boolean) => void;
  increment: (id: number, isPromotional?: boolean) => void;
  decrement: (id: number, isPromotional?: boolean) => void;
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

      recalculate: async () => {
        const { items, appliedPromotion, removePromotion } = get();

        // 1. Basic Calculations
        const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
        const subtotalRaw = items.reduce(
          (acc, i) => acc + i.quantity * i.price,
          0,
        );
        const subtotal = Number(subtotalRaw.toFixed(2));

        // ----------------------------
        // 🔥 HARD BUNDLE GUARD
        // ----------------------------
        if (appliedPromotion?.type === "BUNDLE") {
          const hasPaidItems = items.some((i) => !i.isPromotional);

          // If no paid items remain → remove promotion
          if (!hasPaidItems) {
            removePromotion();
            Toast.show({
              type: "info",
              text1: "Promotion Removed",
              text2: "Required items no longer in cart",
            });
            return;
          }
        }

        // 2. Validate existing promotion against current cart state
        if (appliedPromotion) {
          const order = {
            items: items.map((i) => ({
              id: i.id,
              quantity: i.quantity,
              price: i.price,
            })),
            total: subtotal,
          };

          const validationResult = await validate(appliedPromotion, order);

          // 🔥 QOL: If the cart no longer meets coupon conditions, strip it
          if (!validationResult.valid) {
            removePromotion();
            Toast.show({
              type: "info",
              text1: "Promotion Removed",
              text2: "Cart no longer meets the required conditions",
            });
            return; // removePromotion calls recalculate again, so we exit here
          }
        }

        // 3. Reset state if cart is empty
        if (subtotal === 0 && items.length === 0) {
          set({
            appliedPromotion: null,
            discountAmount: 0,
            totalItems: 0,
            subtotal: 0,
            total: 0,
          });
          return;
        }

        // 4. Calculate Discounts
        let discountAmount = 0;
        if (appliedPromotion) {
          if (
            appliedPromotion.type === "PERCENTAGE" &&
            appliedPromotion.percent_off
          ) {
            discountAmount = (subtotal * appliedPromotion.percent_off) / 100;
          } else if (
            appliedPromotion.type === "FIXED" &&
            appliedPromotion.flat_amount
          ) {
            discountAmount = Number(appliedPromotion.flat_amount);
          }
        }

        discountAmount = Math.min(discountAmount, subtotal);
        const total = Number((subtotal - discountAmount).toFixed(2));

        set({
          totalItems,
          subtotal,
          discountAmount: Number(discountAmount.toFixed(2)),
          total,
        });
      },

      // ----------------------------
      // CART ACTIONS
      // ----------------------------

      // ----------------------------
      // CART ACTIONS (UPDATED TO ASYNC)
      // ----------------------------
      addItem: async (item, qty = 1) => {
        if (item.out_of_stock) return;
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && !i.isPromotional,
          );
          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === item.id && !i.isPromotional
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              )
            : [
                ...state.items,
                { ...item, quantity: qty, isPromotional: false },
              ];
          return { items: updatedItems };
        });
        await get().recalculate();
      },

      removeItem: async (id, isPromotional = false) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.isPromotional === isPromotional),
          ),
        }));
        await get().recalculate();
      },
      increment: async (id, isPromotional = false) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.isPromotional === isPromotional
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        }));
        await get().recalculate();
      },

      decrement: async (id, isPromotional = false) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id && i.isPromotional === isPromotional
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
        await get().recalculate();
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
        // 🔥 BUNDLE LOGIC (IMPROVED)
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
              // Look for an existing PROMOTIONAL version of this item
              const existingPromo = updatedItems.find(
                (i) => i.id === bundleItem.item_id && i.isPromotional === true,
              );

              if (existingPromo) {
                existingPromo.quantity += bundleItem.quantity;
              } else {
                updatedItems.push({
                  id: bundleItem.item_id,
                  name: bundleItem.name,
                  price: 0, // 🔥 Reward items are free
                  out_of_stock: false,
                  quantity: bundleItem.quantity,
                  isPromotional: true, // 🔥 Marks it as a free reward
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
        set((state) => ({
          appliedPromotion: null,
          // 🔥 Purge all free items when promotion is removed
          items: state.items.filter((item) => !item.isPromotional),
        }));
        // We use a sync version or ensure this doesn't loop
        const { items } = get();
        const subtotal = items.reduce(
          (acc, i) => acc + i.quantity * i.price,
          0,
        );
        set({
          subtotal: Number(subtotal.toFixed(2)),
          discountAmount: 0,
          total: Number(subtotal.toFixed(2)),
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
