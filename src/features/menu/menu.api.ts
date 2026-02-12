import { axiosInstance } from "@/src/lib/axios";
import axios from "axios";
import { Menu } from "./menu.types";
export const fetchMenu = async (): Promise<Menu> => {
  try {
    const response = await axiosInstance.get("/menu");
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Menu API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Throw clean message for React Query
      throw new Error(error.response?.data?.message || "Failed to fetch menu");
    }

    console.error("Unexpected Error:", error);
    throw new Error("Unexpected error occurred");
  }
};
