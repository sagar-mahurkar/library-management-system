import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "../types/api.types";
import type { Student } from "../types/book.types";
import type { PageResult } from "./booksService";
export async function listStudents(params: { search?: string; page?: number; limit?: number } = {}): Promise<PageResult<Student>> {
  const response = (await apiClient.get<ApiEnvelope<Student[]>>("/students", { params })).data;
  return { items: response.data, page: response.meta?.page ?? 1, limit: response.meta?.limit ?? response.data.length, total: response.meta?.total ?? response.data.length };
}
export async function getStudent(id: string): Promise<Student> { return (await apiClient.get<ApiEnvelope<Student>>(`/students/${id}`)).data.data; }
