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
  fetchCoupon,
  fetchDiscounts,
  fetchExpiredPromotions,
  togglePromotion,
} from "./promotions.api";

export const useActivePromotions = () => {
  return useQuery({
    queryKey: ["promotions", "active"],
    queryFn: fetchActivePromotions,
    staleTime: 0,
  });
};

export const useExpiredPromotions = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ["promotions", "expired", page, limit],
    queryFn: () => fetchExpiredPromotions(page, limit),
    staleTime: 0,
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

export const useTogglePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      togglePromotion(id, active),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ["promotions"] });

      const previousActive = queryClient.getQueryData(["promotions", "active"]);

      const previousExpiredQueries = queryClient.getQueriesData([
        "promotions",
        "expired",
      ] as QueryFilters);

      // 1️⃣ Update ACTIVE cache
      queryClient.setQueryData(["promotions", "active"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((p: any) => (p.id === id ? { ...p, active } : p)),
        };
      });

      // 2️⃣ Update EXPIRED pages
      previousExpiredQueries.forEach(([queryKey, queryData]: any) => {
        if (!queryData?.data) return;

        queryClient.setQueryData(queryKey, {
          ...queryData,
          data: queryData.data.map((p: any) =>
            p.id === id ? { ...p, active } : p,
          ),
        });
      });

      return { previousActive, previousExpiredQueries };
    },

    // 🔁 Rollback if failed
    onError: (_err, _variables, context: any) => {
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

    // 🔄 Ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

export const useDiscounts = () => {
  return useQuery({
    queryKey: ["promotions", "discounts"],
    queryFn: fetchDiscounts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (code: string) => fetchCoupon(code),
  });
};
