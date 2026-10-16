import axios from "axios";
import { appConfig } from "../config/env";

export const TOKEN_STORAGE_KEY = "library_access_token";
export const apiClient = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: appConfig.apiTimeout,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
