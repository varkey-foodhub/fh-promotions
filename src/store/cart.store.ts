import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  out_of_stock: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
};

interface CartState {
  items: CartItem[];

  totalItems: number;
  subtotal: number;

  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clearCart: () => void;

  recalculate: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,

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
          totalItems: 0,
          subtotal: 0,
        });
      },

      recalculate: () => {
        const items = get().items;

        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        const subtotal = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0,
        );

        set({ totalItems, subtotal });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
