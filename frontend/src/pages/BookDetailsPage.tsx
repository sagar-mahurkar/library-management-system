import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { mockBooks } from "../data/mockData";
export default function BookDetailsPage() {
  const { id } = useParams(); const book = mockBooks.find(item => item.id === id);
  if (!book) return <div className="alert alert-warning">Book not found in the sample catalogue. <Link to="/books">Back to books</Link></div>;
  return <><PageHeader title="Book details" /><div className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex gap-4"><div className="book-cover" style={{ width: 90, height: 120 }}><i className="bi bi-book fs-2" /></div><div><h2 className="h4">{book.title}</h2><p className="text-secondary">{book.authors.map(a => a.name).join(", ")}</p><p className="mb-1">ISBN: {book.isbn ?? "—"}</p><p className="mb-1">Publisher: {book.publisher ?? "—"}</p><p className="mb-3">Publication year: {book.publicationYear ?? "—"}</p><StatusBadge status={book.availableCopies > 0 ? "AVAILABLE" : "UNAVAILABLE"} /><p className="small text-secondary mt-2">{book.availableCopies} of {book.totalCopies} copies available</p></div></div><div className="alert alert-info mt-4 mb-0">Book details are using local sample data until Phase 12.</div></div></div></>;
}
