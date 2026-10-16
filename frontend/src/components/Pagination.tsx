interface Props { page: number; totalPages: number; onPageChange: (page: number) => void }
export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return <nav aria-label="Pagination"><ul className="pagination justify-content-end mb-0">
    <li className={`page-item${page <= 1 ? " disabled" : ""}`}><button className="page-link" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Previous</button></li>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <li key={n} className={`page-item${n === page ? " active" : ""}`}><button className="page-link" onClick={() => onPageChange(n)}>{n}</button></li>)}
    <li className={`page-item${page >= totalPages ? " disabled" : ""}`}><button className="page-link" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</button></li>
  </ul></nav>;
}
