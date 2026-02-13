// src/features/cart/cart.query.ts

import { useCartStore } from "@/src/store/cart.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { placeOrder } from "./cart.api";
import { PlaceOrderPayload } from "./cart.types";
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),

    onSuccess: () => {
      // Clear cart only after successful order
      clearCart();

      router.navigate("/menu/success");
      // Optional: invalidate orders list if you have one
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
