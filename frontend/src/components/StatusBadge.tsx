import type { BorrowingStatus } from "../types/borrowing.types";
const styles: Record<BorrowingStatus | "AVAILABLE" | "UNAVAILABLE", string> = {
  ACTIVE: "text-bg-primary", OVERDUE: "text-bg-danger", RETURNED: "text-bg-secondary", AVAILABLE: "text-bg-success", UNAVAILABLE: "text-bg-warning",
};
export default function StatusBadge({ status }: { status: BorrowingStatus | "AVAILABLE" | "UNAVAILABLE" }) {
  return <span className={`badge ${styles[status]}`}>{status.toLowerCase().replace("_", " ")}</span>;
}
