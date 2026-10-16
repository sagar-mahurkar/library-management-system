import axios from "axios";
import { appConfig } from "../config/env";

// Configured for Phase 12 integration. Phase 11 pages intentionally use local mock data.
export const apiClient = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: appConfig.apiTimeout,
  headers: { "Content-Type": "application/json" },
});
