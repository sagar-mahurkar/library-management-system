import { useState } from "react";
import BookForm from "../components/forms/BookForm";
import BookTable from "../components/BookTable";
import PageHeader from "../components/PageHeader";
import { mockBooks } from "../data/mockData";
export default function ManageBooksPage() {
  const [showForm, setShowForm] = useState(false);
  return <><PageHeader title="Manage books" description="Maintain catalogue records." action={<button className="btn btn-primary" onClick={() => setShowForm(v => !v)}><i className="bi bi-plus-lg me-2" />Add book</button>} />
    {showForm && <div className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h5">New book</h2><BookForm onCancel={() => setShowForm(false)} /></div></div>}
    <div className="card border-0 shadow-sm"><div className="card-body"><BookTable books={mockBooks} onEdit={book => window.alert(`UI preview: edit ${book.title} in Phase 12.`)} onDelete={book => window.alert(`UI preview: delete ${book.title} in Phase 12.`)} /></div></div></>;
}
