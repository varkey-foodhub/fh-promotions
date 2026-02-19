import { CartItem } from "@/src/features/cart/cart.types";
import { MenuItem } from "@/src/features/menu/menu.types";
import { Bundle, Promotion } from "@/src/features/promotions/promotions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  appliedPromotion: Promotion | null;
  discountAmount: number;
  totalItems: number;
  subtotal: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  appliedPromotion: null,
  discountAmount: 0,
  totalItems: 0,
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ---- Sync state updates (called BY sagas, not directly) ----
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setTotals(
      state,
      action: PayloadAction<{
        totalItems: number;
        subtotal: number;
        discountAmount: number;
        total: number;
      }>,
    ) {
      Object.assign(state, action.payload);
    },
    setAppliedPromotion(state, action: PayloadAction<Promotion | null>) {
      state.appliedPromotion = action.payload;
    },
    setDiscountAmount(state, action: PayloadAction<number>) {
      state.discountAmount = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetCart(state) {
      Object.assign(state, initialState);
    },

    // ---- Action triggers (sagas listen for these) ----
    addItemRequest(
      _state,
      _action: PayloadAction<{ item: MenuItem; qty?: number }>,
    ) {},
    removeItemRequest(
      _state,
      _action: PayloadAction<{ id: number; isPromotional?: boolean }>,
    ) {},
    incrementRequest(
      _state,
      _action: PayloadAction<{ id: number; isPromotional?: boolean }>,
    ) {},
    decrementRequest(
      _state,
      _action: PayloadAction<{ id: number; isPromotional?: boolean }>,
    ) {},
    applyPromotionRequest(
      _state,
      _action: PayloadAction<{
        promotion: Promotion;
        resolvedBundleItems: Bundle[];
      }>,
    ) {},
    removePromotionRequest(_state) {},
    clearCartRequest(_state) {},
  },
});

export const {
  setItems,
  setTotals,
  setAppliedPromotion,
  setDiscountAmount,
  setLoading,
  setError,
  resetCart,
  addItemRequest,
  removeItemRequest,
  incrementRequest,
  decrementRequest,
  applyPromotionRequest,
  removePromotionRequest,
  clearCartRequest,
} = cartSlice.actions;

export default cartSlice.reducer;
