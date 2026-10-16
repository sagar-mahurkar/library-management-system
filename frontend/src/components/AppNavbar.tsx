import { Link } from "react-router-dom";
export default function AppNavbar() {
  return <nav className="navbar navbar-expand bg-white border-bottom px-3 px-lg-4"><Link to="/books" className="navbar-brand fw-semibold"><i className="bi bi-book-half text-primary me-2" />Library LMS</Link><div className="ms-auto d-flex align-items-center gap-3"><span className="small text-secondary d-none d-sm-inline">Phase 11 UI preview</span><Link to="/login" className="btn btn-sm btn-outline-primary">Sign in</Link></div></nav>;
}
