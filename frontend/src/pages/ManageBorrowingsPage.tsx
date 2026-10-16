import { useState } from "react";
import BorrowingTable from "../components/BorrowingTable";
import PageHeader from "../components/PageHeader";
import { mockBorrowings } from "../data/mockData";
import type { Borrowing } from "../types/borrowing.types";
export default function ManageBorrowingsPage() {
  const [rows, setRows] = useState(mockBorrowings);
  const [status, setStatus] = useState("all");
  const filtered = rows.filter(b => status === "all" || b.status.toLowerCase() === status);
  const recordReturn = (item: Borrowing) => setRows(prev => prev.map(b => b.id === item.id ? { ...b, status: "RETURNED", returnedAt: new Date().toISOString().slice(0, 10) } : b));
  return <><PageHeader title="Borrowings" description="Review issues, overdue items, and returns." /><div className="d-flex justify-content-end mb-3"><select className="form-select" style={{ maxWidth: 220 }} value={status} onChange={e => setStatus(e.target.value)}><option value="all">All records</option><option value="active">Active</option><option value="overdue">Overdue</option><option value="returned">Returned</option></select></div><div className="card border-0 shadow-sm"><BorrowingTable borrowings={filtered} showStudent onReturn={recordReturn} /></div><p className="small text-secondary mt-2">Recording a return updates this local preview only; persistent changes are implemented in Phase 12.</p></>;
}
