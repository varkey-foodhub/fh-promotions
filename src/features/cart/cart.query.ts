// src/features/cart/cart.query.ts

import { clearCartRequest } from "@/src/store/cart/cart.slice";
import { useAppDispatch } from "@/src/store/cart/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { placeOrder } from "./cart.api";
import { PlaceOrderPayload } from "./cart.types";
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),

    onSuccess: () => {
      // Clear cart only after successful order
      dispatch(clearCartRequest());

      router.navigate("/menu/success");
      // Optional: invalidate orders list if you have one
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
