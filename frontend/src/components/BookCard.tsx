import { Link } from "react-router-dom";
import type { Book } from "../types/book.types";
import StatusBadge from "./StatusBadge";
export default function BookCard({ book }: { book: Book }) {
  return <article className="card h-100 border-0 shadow-sm"><div className="card-body d-flex gap-3">
    <div className="book-cover"><i className="bi bi-book" /></div><div className="min-w-0 flex-grow-1">
      <h2 className="h6 mb-1"><Link to={`/books/${book.id}`}>{book.title}</Link></h2>
      <p className="small text-secondary mb-2">{book.authors.map(a => a.name).join(", ") || "Author not listed"}</p>
      <StatusBadge status={book.availableCopies > 0 ? "AVAILABLE" : "UNAVAILABLE"} />
      <div className="small text-secondary mt-2">{book.availableCopies} of {book.totalCopies} copies available</div>
    </div></div></article>;
}
