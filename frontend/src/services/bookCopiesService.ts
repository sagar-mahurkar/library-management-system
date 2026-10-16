import type { ApiEnvelope } from "../types/api.types";
import type { BookCopy } from "../types/book.types";
import { apiClient } from "./apiClient";
export async function listBookCopies(bookId: string): Promise<BookCopy[]> { return (await apiClient.get<ApiEnvelope<BookCopy[]>>(`/books/${bookId}/copies`)).data.data; }
export async function createBookCopy(bookId: string, copyCode: string): Promise<BookCopy> { return (await apiClient.post<ApiEnvelope<BookCopy>>(`/books/${bookId}/copies`, { copyCode })).data.data; }
export async function deleteBookCopy(id: string): Promise<void> { await apiClient.delete(`/copies/${id}`); }
