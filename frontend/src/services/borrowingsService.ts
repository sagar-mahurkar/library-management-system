import { apiClient } from "./apiClient";
import type { ApiEnvelope } from "../types/api.types";
import type { ApiBorrowing, Borrowing, BorrowingFilter, IssueBorrowingInput } from "../types/borrowing.types";
import { mapBorrowing } from "../types/borrowing.types";
import type { PageResult } from "./booksService";
async function list(path: string, params: { page?: number; limit?: number; status?: BorrowingFilter } = {}): Promise<PageResult<Borrowing>> {
 const response = (await apiClient.get<ApiEnvelope<ApiBorrowing[]>>(path, { params })).data;
 return { items: response.data.map(mapBorrowing), page: response.meta?.page ?? 1, limit: response.meta?.limit ?? response.data.length, total: response.meta?.total ?? response.data.length };
}
export function listMyBorrowings(params: { page?: number; limit?: number; status?: BorrowingFilter } = {}) { return list("/borrowings/me", params); }
export function listStudentBorrowings(studentId: string, params: { page?: number; limit?: number; status?: BorrowingFilter } = {}) { return list(`/students/${studentId}/borrowings`, params); }
export function listAllBorrowings(params: { page?: number; limit?: number; status?: BorrowingFilter } = {}) { return list("/borrowings", params); }
export async function issueBorrowing(input: IssueBorrowingInput): Promise<Borrowing> { return mapBorrowing((await apiClient.post<ApiEnvelope<ApiBorrowing>>("/borrowings", input)).data.data); }
export async function returnBorrowing(id: string): Promise<Borrowing> { return mapBorrowing((await apiClient.patch<ApiEnvelope<ApiBorrowing>>(`/borrowings/${id}/return`)).data.data); }
