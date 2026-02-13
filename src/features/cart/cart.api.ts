// src/features/cart/cart.api.ts

import { axiosInstance } from "@/src/lib/axios";
import axios from "axios";
import { PlaceOrderPayload, PlaceOrderResponse } from "./cart.types";

export const placeOrder = async (
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResponse["data"]> => {
  try {
    const response = await axiosInstance.post("/orders", payload);

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to place order");
    }

    throw new Error("Unexpected error occurred");
  }
};
