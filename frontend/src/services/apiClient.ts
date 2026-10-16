import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});
