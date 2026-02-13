import { useQuery } from "@tanstack/react-query";
import { searchPhotos } from "./pexels.api";

export const useFoodImages = (query: string) => {
  return useQuery({
    queryKey: ["pexels", query],
    queryFn: () => searchPhotos(query),
    enabled: !!query,
  });
};
