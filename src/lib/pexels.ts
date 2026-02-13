import axios from "axios";

const PEXELS_KEY = process.env.EXPO_PUBLIC_PEXELS_KEY;

export const pexelsClient = axios.create({
  baseURL: "https://api.pexels.com/v1",
  headers: {
    Authorization: PEXELS_KEY,
  },
});
