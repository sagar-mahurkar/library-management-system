import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { mockBorrowings } from "../data/mockData";
import BorrowingTable from "../components/BorrowingTable";
export default function StudentDashboardPage() {
  const active = mockBorrowings.filter(b => b.studentName === "Aarav Sharma" && b.status !== "RETURNED");
  return <><PageHeader title="Student dashboard" description="Your library activity at a glance." /><div className="row g-3 mb-4">{[{ label: "Current borrowings", value: active.length, icon: "journal-bookmark" }, { label: "Overdue items", value: active.filter(b => b.status === "OVERDUE").length, icon: "clock-history" }].map(m => <div className="col-12 col-md-6" key={m.label}><div className="card metric-card"><div className="card-body d-flex align-items-center gap-3"><span className="book-cover"><i className={`bi bi-${m.icon}`} /></span><div><div className="text-secondary small">{m.label}</div><div className="h3 mb-0">{m.value}</div></div></div></div></div>)}</div><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">Your current loans</h2><Link to="/student/borrowings">View history</Link></div><div className="card border-0 shadow-sm"><BorrowingTable borrowings={active} /></div><Link to="/books" className="btn btn-primary mt-4"><i className="bi bi-search me-2" />Browse catalogue</Link></>;
}
