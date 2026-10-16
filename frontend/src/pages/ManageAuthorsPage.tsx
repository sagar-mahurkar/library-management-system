import { useState } from "react";
import AuthorForm from "../components/forms/AuthorForm";
import PageHeader from "../components/PageHeader";
import { mockAuthors } from "../data/mockData";
export default function ManageAuthorsPage() {
  const [showForm, setShowForm] = useState(false);
  return <><PageHeader title="Manage authors" description="Authors associated with catalogue titles." action={<button className="btn btn-primary" onClick={() => setShowForm(v => !v)}><i className="bi bi-plus-lg me-2" />Add author</button>} />
    {showForm && <div className="card border-0 shadow-sm mb-4"><div className="card-body"><AuthorForm /></div></div>}
    <div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Author</th><th>ID</th><th className="text-end">Actions</th></tr></thead><tbody>{mockAuthors.map(a => <tr key={a.id}><td>{a.name}</td><td className="text-secondary">{a.id}</td><td className="text-end"><button className="btn btn-sm btn-outline-secondary" onClick={() => window.alert("UI preview only.")}>Edit</button></td></tr>)}</tbody></table></div></div></>;
}
