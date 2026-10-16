export interface Author { id: string; name: string }
export interface Book {
  id: string;
  title: string;
  isbn: string | null;
  publisher: string | null;
  publicationYear: number | null;
  authors: Author[];
  totalCopies: number;
  availableCopies: number;
}
export interface BookInput {
  title: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  authorIds: string[];
}
export interface BookCopy { id: string; bookId: string; copyCode: string; available: boolean }
