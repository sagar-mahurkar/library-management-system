import type { Book } from "../types/book.types";
import StatusBadge from "./StatusBadge";
interface Props { books: Book[]; onEdit?: (book: Book) => void; onDelete?: (book: Book) => void }
export default function BookTable({ books, onEdit, onDelete }: Props) {
  return <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Book</th><th>ISBN</th><th>Authors</th><th>Availability</th><th className="text-end">Actions</th></tr></thead>
    <tbody>{books.map(book => <tr key={book.id}><td><strong>{book.title}</strong><div className="small text-secondary">{book.publisher ?? "Publisher not listed"}</div></td><td>{book.isbn ?? "—"}</td><td>{book.authors.map(a => a.name).join(", ") || "—"}</td><td><StatusBadge status={book.availableCopies > 0 ? "AVAILABLE" : "UNAVAILABLE"} /><div className="small text-secondary mt-1">{book.availableCopies}/{book.totalCopies} available</div></td><td className="text-end text-nowrap">{onEdit && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`}><i className="bi bi-pencil" /></button>}{onDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(book)} aria-label={`Delete ${book.title}`}><i className="bi bi-trash" /></button>}</td></tr>)}</tbody>
  </table></div>;
}
