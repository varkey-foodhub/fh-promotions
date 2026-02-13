import { pexelsClient } from "@/src/lib/pexels";

export const searchPhotos = async (query: string) => {
  const response = await pexelsClient.get("/search", {
    params: {
      query,
      per_page: 10,
    },
  });

  return response.data.photos;
};
