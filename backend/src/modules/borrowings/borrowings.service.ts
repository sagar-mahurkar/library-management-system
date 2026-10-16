import { borrowingsRepository, BorrowingsRepository } from "./borrowings.repository";
import type { IssueBorrowingInput, ListBorrowingsQuery } from "./borrowings.schemas";
export class BorrowingsServiceError extends Error { constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); this.name = "BorrowingsServiceError"; } }
function translate(error: unknown): never {
  if (error instanceof Error) {
    const map: Record<string, [number, string, string]> = {
      STUDENT_NOT_FOUND: [404, "STUDENT_NOT_FOUND", "Student not found"], COPY_NOT_FOUND: [404, "COPY_NOT_FOUND", "Physical copy not found"],
      COPY_UNAVAILABLE: [409, "COPY_UNAVAILABLE", "Physical copy is already issued"], INVALID_DUE_DATE: [400, "INVALID_DUE_DATE", "Due date must be in the future"],
      BORROWING_NOT_FOUND: [404, "BORROWING_NOT_FOUND", "Borrowing record not found"], ALREADY_RETURNED: [409, "ALREADY_RETURNED", "This borrowing has already been returned"],
    };
    const entry = map[error.message]; if (entry) throw new BorrowingsServiceError(...entry);
  }
  if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") throw new BorrowingsServiceError(409, "COPY_UNAVAILABLE", "Physical copy is already issued");
  throw error;
}
function normalize(item: any) { const overdue = item.returnedAt == null && new Date(item.dueAt).getTime() < Date.now(); return { id: item.id, student: item.user ? { id: item.user.id, name: item.user.name, email: item.user.email } : undefined, copy: item.bookCopy ? { id: item.bookCopy.id, copyCode: item.bookCopy.copyCode, book: item.bookCopy.book ? { id: item.bookCopy.book.id, title: item.bookCopy.book.title, isbn: item.bookCopy.book.isbn } : undefined } : undefined, issuedAt: item.issuedAt, dueAt: item.dueAt, returnedAt: item.returnedAt, overdue }; }
export class BorrowingsService {
  constructor(private readonly repository: BorrowingsRepository = borrowingsRepository) {}
  async issue(input: IssueBorrowingInput) { try { return normalize(await this.repository.issue(input)); } catch (error) { return translate(error); } }
  async return(id: string) { try { return normalize(await this.repository.returnBorrowing(id)); } catch (error) { return translate(error); } }
  async listForStudent(studentId: string, query: ListBorrowingsQuery) { const result = await this.repository.listForStudent(studentId, query); return { data: result.items.map(normalize), meta: { page: query.page, limit: query.limit, total: result.total } }; }
  async listAll(query: ListBorrowingsQuery) { const result = await this.repository.listAll(query); return { data: result.items.map(normalize), meta: { page: query.page, limit: query.limit, total: result.total } }; }
}
export const borrowingsService = new BorrowingsService();
