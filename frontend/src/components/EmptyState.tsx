export default function EmptyState({ title = "Nothing here yet", message = "Try changing your search or filters." }: { title?: string; message?: string }) {
  return <div className="text-center py-5 text-secondary"><i className="bi bi-inbox fs-1 d-block mb-2" /><h2 className="h5 text-dark">{title}</h2><p className="mb-0">{message}</p></div>;
}
