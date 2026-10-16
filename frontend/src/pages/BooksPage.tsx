import { useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { mockBooks } from "../data/mockData";
export default function BooksPage() {
  const [search, setSearch] = useState(""); const [availability, setAvailability] = useState("all");
  const books = useMemo(() => mockBooks.filter(book => `${book.title} ${book.authors.map(a => a.name).join(" ")}`.toLowerCase().includes(search.toLowerCase()) && (availability === "all" || (availability === "available" ? book.availableCopies > 0 : book.availableCopies === 0))), [search, availability]);
  return <><PageHeader title="Browse books" description="Discover titles in the library catalogue." /><div className="row g-2 mb-4"><div className="col-md-8"><input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author" aria-label="Search books" /></div><div className="col-md-4"><select className="form-select" value={availability} onChange={e => setAvailability(e.target.value)} aria-label="Filter availability"><option value="all">All availability</option><option value="available">Available now</option><option value="unavailable">Currently unavailable</option></select></div></div>
    {books.length ? <div className="row g-3">{books.map(book => <div className="col-12 col-lg-6" key={book.id}><BookCard book={book} /></div>)}</div> : <div className="card border-0"><EmptyState title="No books found" /></div>}</>;
}
