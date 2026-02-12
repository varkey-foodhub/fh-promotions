import { axiosInstance } from "@/src/lib/axios";
import axios from "axios";
import {
  ActivePromotionsResponse,
  ExpiredPromotionsResponse,
} from "./promotions.types";

export const fetchActivePromotions =
  async (): Promise<ActivePromotionsResponse> => {
    try {
      const response = await axiosInstance.get("/promotions/active");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Promotions API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        throw new Error(
          error.response?.data?.message || "Failed to fetch active promotions",
        );
      }
      console.error("Unexpected Error:", error);
      throw new Error("Unexpected error occurred");
    }
  };

export const fetchExpiredPromotions = async (
  page: number = 1,
  limit: number = 5,
): Promise<ExpiredPromotionsResponse> => {
  try {
    const response = await axiosInstance.get(
      `/promotions/expired?page=${page}&limit=${limit}`,
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Promotions API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to fetch expired promotions",
      );
    }
    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};
