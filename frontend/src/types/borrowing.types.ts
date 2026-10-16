export type BorrowingStatus = "ACTIVE" | "OVERDUE" | "RETURNED";
export interface Borrowing {
  id: string;
  studentName: string;
  bookTitle: string;
  copyCode: string;
  issuedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: BorrowingStatus;
}
