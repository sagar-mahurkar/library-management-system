export default function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return <div className="alert alert-danger d-flex gap-2" role="alert"><i className="bi bi-exclamation-triangle" />{message}</div>;
}
