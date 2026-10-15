import { booksRepository, BooksRepository } from "./books.repository";
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from "./books.schemas";

export class BooksServiceError extends Error {
  constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); this.name = "BooksServiceError"; }
}
function normalizeBook(book: any) {
  const copies = book.copies ?? [];
  const active = copies.reduce((sum: number, copy: any) => sum + ((copy.borrowings ?? []).some((borrowing: any) => borrowing.returnedAt == null) ? 1 : 0), 0);
  return {
    id: book.id, title: book.title, isbn: book.isbn, publisher: book.publisher,
    publicationYear: book.publicationYear,
    authors: (book.bookAuthors ?? []).map((entry: any) => ({ id: entry.author.id, name: entry.author.name })),
    totalCopies: copies.length, availableCopies: copies.length - active,
    createdAt: book.createdAt, updatedAt: book.updatedAt,
  };
}
function translate(error: unknown): never {
  if (error instanceof Error && error.message === "AUTHOR_NOT_FOUND") throw new BooksServiceError(400, "AUTHOR_NOT_FOUND", "One or more authors do not exist");
  if (error instanceof Error && error.message === "BOOK_HAS_COPIES") throw new BooksServiceError(409, "BOOK_HAS_COPIES", "Remove the book's physical copies before deleting the book");
  if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") throw new BooksServiceError(409, "BOOK_CONFLICT", "A book with this ISBN already exists");
  throw error;
}
export class BooksService {
  constructor(private readonly repository: BooksRepository = booksRepository) {}
  async list(query: ListBooksQuery) {
    const result = await this.repository.list(query);
    return { data: result.items.map(normalizeBook), meta: { page: query.page, limit: query.limit, total: result.total } };
  }
  async getById(id: string) {
    const book = await this.repository.findById(id);
    if (!book) throw new BooksServiceError(404, "BOOK_NOT_FOUND", "Book not found");
    return normalizeBook(book);
  }
  async create(input: CreateBookInput) {
    try { return normalizeBook(await this.repository.create(input)); } catch (error) { return translate(error); }
  }
  async update(id: string, input: UpdateBookInput) {
    try {
      const book = await this.repository.update(id, input);
      if (!book) throw new BooksServiceError(404, "BOOK_NOT_FOUND", "Book not found");
      return normalizeBook(book);
    } catch (error) { if (error instanceof BooksServiceError) throw error; return translate(error); }
  }
  async remove(id: string) {
    try {
      if (!(await this.repository.remove(id))) throw new BooksServiceError(404, "BOOK_NOT_FOUND", "Book not found");
    } catch (error) { if (error instanceof BooksServiceError) throw error; return translate(error); }
  }
}
export const booksService = new BooksService();
