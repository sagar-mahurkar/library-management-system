export interface Author { id: string; name: string }
export interface Book { id: string; title: string; isbn: string | null; publisher: string | null; publicationYear: number | null; authors: Author[]; totalCopies: number; availableCopies: number; createdAt?: string; updatedAt?: string }
export interface BookInput { title: string; isbn?: string | null; publisher?: string | null; publicationYear?: number; authorIds: string[] }
export interface BookCopy { id: string; bookId: string; copyCode: string; available: boolean; createdAt?: string }
export interface AuthorInput { name: string }
export interface Student { id: string; name: string; email: string; role: "STUDENT"; createdAt?: string; activeBorrowings?: number }
