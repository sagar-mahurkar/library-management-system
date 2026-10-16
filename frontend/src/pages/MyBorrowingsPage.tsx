import { useState } from "react";
import BorrowingTable from "../components/BorrowingTable";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { mockBorrowings } from "../data/mockData";
export default function MyBorrowingsPage() {
  const [status, setStatus] = useState("all");
  const rows = mockBorrowings.filter(b => b.studentName === "Aarav Sharma" && (status === "all" || b.status.toLowerCase() === status));
  return <><PageHeader title="My borrowings" description="Current loans and previous returns." /><div className="d-flex justify-content-end mb-3"><select className="form-select" style={{ maxWidth: 220 }} value={status} onChange={e => setStatus(e.target.value)}><option value="all">All records</option><option value="active">Active</option><option value="overdue">Overdue</option><option value="returned">Returned</option></select></div><div className="card border-0 shadow-sm">{rows.length ? <BorrowingTable borrowings={rows} /> : <EmptyState title="No matching borrowings" />}</div></>;
}
