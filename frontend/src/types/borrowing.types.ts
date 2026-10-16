export type BorrowingStatus = "ACTIVE" | "OVERDUE" | "RETURNED";
export interface Borrowing { id: string; studentId?: string; studentName?: string; studentEmail?: string; bookTitle: string; copyCode: string; bookCopyId?: string; issuedAt: string; dueAt: string; returnedAt: string | null; status: BorrowingStatus }
export interface ApiBorrowing { id: string; student?: { id: string; name: string; email: string }; copy?: { id: string; copyCode: string; book?: { id: string; title: string; isbn: string | null } }; issuedAt: string; dueAt: string; returnedAt: string | null; overdue: boolean }
export interface IssueBorrowingInput { studentId: string; bookCopyId: string; dueAt: string }
export type BorrowingFilter = "all" | "active" | "overdue" | "returned";
export function mapBorrowing(item: ApiBorrowing): Borrowing {
 const status: BorrowingStatus = item.returnedAt ? "RETURNED" : item.overdue ? "OVERDUE" : "ACTIVE";
 return { id: item.id, studentId: item.student?.id, studentName: item.student?.name ?? "—", studentEmail: item.student?.email, bookTitle: item.copy?.book?.title ?? "Unknown book", copyCode: item.copy?.copyCode ?? "—", bookCopyId: item.copy?.id, issuedAt: item.issuedAt, dueAt: item.dueAt, returnedAt: item.returnedAt, status };
}
