import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMenu, markBackInStock, markOutOfStock } from "./menu.api";

export const useMenu = () => {
  return useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
    staleTime: 1000 * 60 * 5,
  });
};

// OOS mutation
export const useMarkOutOfStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markOutOfStock,

    onMutate: async (itemId: number) => {
      // Cancel ongoing refetches to prevent them from overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["menu"] });

      // Snapshot the previous data
      const previousData = queryClient.getQueryData<any[]>(["menu"]);

      // Perform optimistic update
      if (previousData) {
        const newData = previousData.map((item) =>
          item.id === itemId ? { ...item, out_of_stock: true } : item,
        );
        queryClient.setQueryData(["menu"], newData);
      }

      return { previousData };
    },

    onError: (err, itemId, context: any) => {
      // Revert to previous data if mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(["menu"], context.previousData);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });
};

// BIS mutation
export const useMarkBackInStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markBackInStock,

    onMutate: async (itemId: number) => {
      // Cancel ongoing refetches to prevent them from overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["menu"] });

      // Snapshot the previous data
      const previousData = queryClient.getQueryData<any[]>(["menu"]);

      // Perform optimistic update
      if (previousData) {
        const newData = previousData.map((item) =>
          item.id === itemId ? { ...item, out_of_stock: false } : item,
        );
        queryClient.setQueryData(["menu"], newData);
      }

      return { previousData };
    },

    onError: (err, itemId, context: any) => {
      // Revert to previous data if mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(["menu"], context.previousData);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });
};
