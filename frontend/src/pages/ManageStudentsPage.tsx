import PageHeader from "../components/PageHeader";
import { mockStudents } from "../data/mockData";
export default function ManageStudentsPage() {
  return <><PageHeader title="Students" description="Student directory and borrowing overview." /><div className="card border-0 shadow-sm"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Email</th><th>Active borrowings</th><th className="text-end">Action</th></tr></thead><tbody>{mockStudents.map(s => <tr key={s.id}><td className="fw-semibold">{s.name}</td><td>{s.email}</td><td>{s.activeBorrowings}</td><td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => window.alert("Student detail view will be connected in Phase 12.")}>View record</button></td></tr>)}</tbody></table></div></div></>;
}
