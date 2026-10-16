import type { Book } from "../types/book.types";
import type { Borrowing } from "../types/borrowing.types";

export const mockBooks: Book[] = [
  { id: "book-1", title: "Clean Code", isbn: "9780132350884", publisher: "Prentice Hall", publicationYear: 2008, authors: [{ id: "author-1", name: "Robert C. Martin" }], totalCopies: 4, availableCopies: 2 },
  { id: "book-2", title: "The Pragmatic Programmer", isbn: "9780135957059", publisher: "Addison-Wesley", publicationYear: 2019, authors: [{ id: "author-2", name: "David Thomas" }, { id: "author-3", name: "Andrew Hunt" }], totalCopies: 3, availableCopies: 1 },
  { id: "book-3", title: "Introduction to Algorithms", isbn: "9780262046305", publisher: "MIT Press", publicationYear: 2022, authors: [{ id: "author-4", name: "Thomas H. Cormen" }], totalCopies: 5, availableCopies: 5 },
  { id: "book-4", title: "Designing Data-Intensive Applications", isbn: "9781449373320", publisher: "O'Reilly Media", publicationYear: 2017, authors: [{ id: "author-5", name: "Martin Kleppmann" }], totalCopies: 2, availableCopies: 0 },
];
export const mockBorrowings: Borrowing[] = [
  { id: "borrow-1", studentName: "Aarav Sharma", bookTitle: "Clean Code", copyCode: "CC-001", issuedAt: "2026-10-01", dueAt: "2026-10-15", returnedAt: null, status: "OVERDUE" },
  { id: "borrow-2", studentName: "Priya Patil", bookTitle: "The Pragmatic Programmer", copyCode: "PP-002", issuedAt: "2026-10-10", dueAt: "2026-10-24", returnedAt: null, status: "ACTIVE" },
  { id: "borrow-3", studentName: "Aarav Sharma", bookTitle: "Introduction to Algorithms", copyCode: "IA-001", issuedAt: "2026-09-01", dueAt: "2026-09-15", returnedAt: "2026-09-12", status: "RETURNED" },
];
export const mockStudents = [
  { id: "student-1", name: "Aarav Sharma", email: "aarav@example.com", activeBorrowings: 1 },
  { id: "student-2", name: "Priya Patil", email: "priya@example.com", activeBorrowings: 1 },
  { id: "student-3", name: "Ishaan Kulkarni", email: "ishaan@example.com", activeBorrowings: 0 },
];
export const mockAuthors = [
  { id: "author-1", name: "Robert C. Martin" },
  { id: "author-2", name: "David Thomas" },
  { id: "author-3", name: "Andrew Hunt" },
  { id: "author-4", name: "Thomas H. Cormen" },
  { id: "author-5", name: "Martin Kleppmann" },
];
