import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "../types/api.types";
import type { LoginInput, LoginResponse, RegisterInput, User } from "../types/auth.types";

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<ApiEnvelope<LoginResponse>>("/auth/login", input);
  return response.data.data;
}
export async function register(input: RegisterInput): Promise<User> {
  const response = await apiClient.post<ApiEnvelope<User>>("/auth/register", input);
  return response.data.data;
}
