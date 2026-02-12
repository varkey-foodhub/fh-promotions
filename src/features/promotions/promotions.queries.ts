import { useQuery } from "@tanstack/react-query";
import {
  fetchActivePromotions,
  fetchExpiredPromotions,
} from "./promotions.api";

export const useActivePromotions = () => {
  return useQuery({
    queryKey: ["promotions", "active"],
    queryFn: fetchActivePromotions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useExpiredPromotions = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ["promotions", "expired", page, limit],
    queryFn: () => fetchExpiredPromotions(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
