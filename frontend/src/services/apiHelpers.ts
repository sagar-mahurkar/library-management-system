import type { AxiosError } from "axios";
import type { ApiEnvelope, ApiErrorBody } from "../types/api.types";

export function unwrapData<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError.response?.data?.error?.message ?? axiosError.message ?? "Something went wrong. Please try again.";
}
