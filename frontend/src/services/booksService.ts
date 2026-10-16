import type { ApiEnvelope } from "../types/api.types";
import type { Author, Book, BookInput } from "../types/book.types";
import { apiClient } from "./apiClient";

export interface PageResult<T> { items: T[]; page: number; limit: number; total: number }
function pageResult<T>(response: ApiEnvelope<T[]>): PageResult<T> {
  return { items: response.data, page: response.meta?.page ?? 1, limit: response.meta?.limit ?? response.data.length, total: response.meta?.total ?? response.data.length };
}
export async function listBooks(params: { search?: string; page?: number; limit?: number } = {}): Promise<PageResult<Book>> {
  return pageResult((await apiClient.get<ApiEnvelope<Book[]>>("/books", { params })).data);
}
export async function getBook(id: string): Promise<Book> { return (await apiClient.get<ApiEnvelope<Book>>(`/books/${id}`)).data.data; }
export async function createBook(input: BookInput): Promise<Book> { return (await apiClient.post<ApiEnvelope<Book>>("/books", input)).data.data; }
export async function updateBook(id: string, input: Partial<BookInput>): Promise<Book> { return (await apiClient.patch<ApiEnvelope<Book>>(`/books/${id}`, input)).data.data; }
export async function deleteBook(id: string): Promise<void> { await apiClient.delete(`/books/${id}`); }
export async function listAuthors(params: { search?: string; page?: number; limit?: number } = {}): Promise<PageResult<Author>> { return pageResult((await apiClient.get<ApiEnvelope<Author[]>>("/authors", { params })).data); }
export async function createAuthor(input: { name: string }): Promise<Author> { return (await apiClient.post<ApiEnvelope<Author>>("/authors", input)).data.data; }
export async function updateAuthor(id: string, input: { name: string }): Promise<Author> { return (await apiClient.patch<ApiEnvelope<Author>>(`/authors/${id}`, input)).data.data; }
export async function deleteAuthor(id: string): Promise<void> { await apiClient.delete(`/authors/${id}`); }
