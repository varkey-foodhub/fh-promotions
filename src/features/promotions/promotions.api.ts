import { axiosInstance } from "@/src/lib/axios";
import axios from "axios";
import {
  ActivePromotionsResponse,
  Bundle,
  BundleModel,
  CreatePromotionPayload,
  ExpiredPromotionsResponse,
  Promotion,
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

export const deletePromotion = async (id: number): Promise<number> => {
  try {
    const response = await axiosInstance.delete(`/promotions/`, {
      data: { id: id },
    });
    return response.data.data.id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Promotions API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete promotion",
      );
    }
    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};

export const createPromotion = async (
  payload: CreatePromotionPayload,
): Promise<number> => {
  try {
    const response = await axiosInstance.post(`/promotions/`, payload);
    return response.data.data.id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Promotions API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete promotion",
      );
    }
    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};

export const togglePromotion = async (
  id: number,
  active: boolean,
): Promise<number> => {
  try {
    const response = await axiosInstance.patch(`/promotions/toggle`, {
      id,
      active,
    });
    return response.data.data.id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Promotions API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to delete promotion",
      );
    }
    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};

export const fetchDiscounts = async (): Promise<Promotion[]> => {
  try {
    const response = await axiosInstance.get("/promotions/discounts");
    return response.data.data; // this is Promotion[]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Discounts API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      throw new Error(
        error.response?.data?.message || "Failed to fetch discounts",
      );
    }

    throw new Error("Unexpected error occurred");
  }
};

export const fetchCoupon = async (code: string): Promise<Promotion> => {
  try {
    const response = await axiosInstance.get(`/promotions/coupons/${code}`);

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Invalid coupon");
    }

    throw new Error("Unexpected error occurred");
  }
};

export const fetchBundle = async (id: number): Promise<Bundle[]> => {
  try {
    const response = await axiosInstance.get(`/promotions/bundle/${id}`);
    console.log(response.data.data);
    return response.data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Invalid bundle id");
    }

    throw new Error("Unexpected error occurred");
  }
};

export const fetchBundles = async (): Promise<BundleModel[]> => {
  try {
    const response = await axiosInstance.get(`/promotions/bundles`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Bundles API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to fetch bundles",
      );
    }
    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};
