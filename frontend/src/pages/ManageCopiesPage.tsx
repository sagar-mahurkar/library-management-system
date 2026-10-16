import { useState } from "react";
import BookCopyForm from "../components/forms/BookCopyForm";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { mockBooks } from "../data/mockData";
const copies = mockBooks.flatMap(book => Array.from({ length: book.totalCopies }, (_, i) => ({ id: `${book.id}-copy-${i + 1}`, title: book.title, copyCode: `${book.title.split(" ").map(w => w[0]).join("").toUpperCase()}-${String(i + 1).padStart(3, "0")}`, available: i < book.availableCopies })));
export default function ManageCopiesPage() {
  const [showForm, setShowForm] = useState(false);
  return <><PageHeader title="Physical copies" description="Track individual copies and their availability." action={<button className="btn btn-primary" onClick={() => setShowForm(v => !v)}><i className="bi bi-plus-lg me-2" />Add copy</button>} />
    {showForm && <div className="card border-0 shadow-sm mb-4"><div className="card-body"><BookCopyForm /></div></div>}
    <div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Copy code</th><th>Book</th><th>Status</th></tr></thead><tbody>{copies.map(c => <tr key={c.id}><td className="fw-semibold">{c.copyCode}</td><td>{c.title}</td><td><StatusBadge status={c.available ? "AVAILABLE" : "UNAVAILABLE"} /></td></tr>)}</tbody></table></div></div></>;
}
