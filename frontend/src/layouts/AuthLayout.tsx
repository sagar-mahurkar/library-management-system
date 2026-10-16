import { Link, Outlet } from "react-router-dom";
export default function AuthLayout() {
  return <main className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
    <Link to="/books" className="text-primary fw-semibold mb-4"><i className="bi bi-book-half me-2" />Library Management System</Link>
    <div className="auth-card"><Outlet /></div>
    <p className="small text-secondary mt-4 mb-0">Library Management System · MVP UI</p>
  </main>;
}
