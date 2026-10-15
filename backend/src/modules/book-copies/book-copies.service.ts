import { bookCopiesRepository, BookCopiesRepository } from "./book-copies.repository";
import type { CreateBookCopyInput } from "./book-copies.schemas";
export class BookCopiesServiceError extends Error { constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); this.name = "BookCopiesServiceError"; } }
export class BookCopiesService {
  constructor(private readonly repository: BookCopiesRepository = bookCopiesRepository) {}
  async list(bookId: string) { if (!(await this.repository.bookExists(bookId))) throw new BookCopiesServiceError(404, "BOOK_NOT_FOUND", "Book not found"); return { data: await this.repository.listAvailability(bookId) }; }
  async create(bookId: string, input: CreateBookCopyInput) { if (!(await this.repository.bookExists(bookId))) throw new BookCopiesServiceError(404, "BOOK_NOT_FOUND", "Book not found"); try { return await this.repository.create(bookId, input); } catch (error) { if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") throw new BookCopiesServiceError(409, "COPY_CODE_ALREADY_EXISTS", "A physical copy with this code already exists"); throw error; } }
  async remove(id: string) { try { if (!(await this.repository.remove(id))) throw new BookCopiesServiceError(404, "COPY_NOT_FOUND", "Physical copy not found"); } catch (error) { if (error instanceof BookCopiesServiceError) throw error; if (error instanceof Error && error.message === "COPY_HAS_HISTORY") throw new BookCopiesServiceError(409, "COPY_HAS_HISTORY", "A copy with borrowing history cannot be deleted"); throw error; } }
}
export const bookCopiesService = new BookCopiesService();
