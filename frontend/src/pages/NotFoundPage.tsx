import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <main className="container py-5 text-center"><div className="display-1 fw-bold text-primary">404</div><h1 className="h3">Page not found</h1><p className="text-secondary">The page you are looking for does not exist.</p><Link className="btn btn-primary" to="/books">Browse books</Link></main>;
}
