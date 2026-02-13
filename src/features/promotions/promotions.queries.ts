import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPromotion,
  deletePromotion,
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

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromotion,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["promotions"] });

      const previousActive = queryClient.getQueryData(["promotions", "active"]);

      const previousExpiredQueries = queryClient.getQueriesData([
        "promotions",
        "expired",
      ] as QueryFilters);

      // Optimistically remove from active
      queryClient.setQueryData(["promotions", "active"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((p: any) => p.id !== id),
        };
      });

      // Optimistically remove from all expired pages
      previousExpiredQueries.forEach(([queryKey, queryData]: any) => {
        if (!queryData?.data) return;

        queryClient.setQueryData(queryKey, {
          ...queryData,
          data: queryData.data.filter((p: any) => p.id !== id),
        });
      });

      return { previousActive, previousExpiredQueries };
    },

    // 🔁 Rollback if failed
    onError: (_err, _id, context: any) => {
      if (context?.previousActive) {
        queryClient.setQueryData(
          ["promotions", "active"],
          context.previousActive,
        );
      }

      if (context?.previousExpiredQueries) {
        context.previousExpiredQueries.forEach(([queryKey, queryData]: any) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
    },

    // 🔄 Refetch after success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPromotion,

    onMutate: async (newPromotion: any) => {
      await queryClient.cancelQueries({ queryKey: ["promotions"] });

      const previousActive = queryClient.getQueryData(["promotions", "active"]);

      // Create temporary optimistic item
      const optimisticPromotion = {
        ...newPromotion,
        id: Date.now(), // temp id
        __optimistic: true,
      };

      // Only add to active if it should be active
      const isActive =
        optimisticPromotion.active &&
        new Date(optimisticPromotion.valid_from) <= new Date() &&
        new Date(optimisticPromotion.valid_to) >= new Date();

      if (isActive) {
        queryClient.setQueryData(["promotions", "active"], (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: [optimisticPromotion, ...old.data],
          };
        });
      }

      return { previousActive };
    },

    onError: (_err, _newPromotion, context: any) => {
      if (context?.previousActive) {
        queryClient.setQueryData(
          ["promotions", "active"],
          context.previousActive,
        );
      }
    },

    onSuccess: () => {
      // Replace optimistic data with real backend data
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};
