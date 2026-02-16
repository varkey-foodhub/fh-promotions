/**
 * Product type stored in cart
 */
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  isPromotional?: boolean; // 🔥 New flag to identify free items
  out_of_stock: boolean;
};

// src/features/cart/cart.types.ts

export interface OrderItemPayload {
  id: number;
  quantity: number;
}

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  promotion_id?: number | null;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    total_price: number;
  };
}
